const { GraphQLError } = require('graphql')

const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// User models 
const User = require('../../models/User')

// user validation 
const {validateRegisterInput, validateLoginInput} = require('../../util/userValidation')

const generateToken = (user) => {
    return jwt.sign({
        id: user.id,
        username: user.username,
    }, process.env.SECRET_KEY, {expiresIn: '5h'})
}

module.exports = {

    Mutation: {
        register: async (_, {registerInput: {username, password, confirmPassword}}) => {

            const {errors, valid} = validateRegisterInput(username, password, confirmPassword)

            if(!valid) {
                throw new GraphQLError('Errors', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        errors
                    }
                })
            }

            // Check if user exist 
            const usernameExist = await User.findOne({username})
            if(usernameExist) {
                throw new GraphQLError('Errors', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        errors: {
                            username: 'Username is taken',
                        },
                    },
                })
            }

            // Hash password 
            password = await bcrypt.hash(password, 12)

            // create a new user 
            const newUser = new User({
                username,
                password,
                createdAt: new Date().toISOString()
            })

            const res = await newUser.save()

            const token = generateToken(res)

            // return data 
            return { 
                ...res._doc,
                id: res.id,
                token
            }

        },

        login: async (_, {username, password}) => {
            const {errors, valid } = validateLoginInput(username, password)

            if(!valid) {
                throw new GraphQLError('Errors', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        errors
                    }
                })
            }

            // check if user exist 
            const user = await User.findOne({username})

            if(!user) {
                errors.general = 'User not found'
                throw new GraphQLError('Errors', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        errors
                    }
                })
            }

            // Check password 
            const match = await bcrypt.compare(password, user.password)

            if(!match) {
                errors.general = 'Wrong Credentials'
                throw new GraphQLError('User not found', {
                    extensions: {
                        code: 'BAD_USER_INPUT',
                        errors
                    }
                })
            }

            const token = generateToken(user)

            return {
                ...user._doc,
                id: user.id,
                token
            }
        },
    }
}