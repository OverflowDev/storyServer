const { GraphQLError } = require('graphql')
const mongoose = require('mongoose')

const Post = require('../../models/Post')
const Category = require('../../models/Category')
// const Image = require('../../models/Image')

const validateAuth = require('../../util/authValidation')

const cloudinary = require('cloudinary').v2

const dotenv = require('dotenv').config()


// // Configuration 
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })

module.exports = {

    Query: {
        getPosts: async () => {
            try {
                const posts = await Post.find().sort({createdAt: -1})
                return posts
            } catch (error) {
                throw new Error(error)
            }
        },

        getPost: async (_, {postId}) => {
            try {
                const post = await Post.findById(postId)
                if(post) {
                    return post
                } else {
                    throw new Error('Post not found')
                }
            } catch (error) {
                throw new Error(error)
            }
        },

    },

    Mutation: {

        createPost: async (_, {postInput: {title, content, category}}, context) => {
            const user = validateAuth(context)

            if(title.trim() === '') {
                throw new Error('Title cannot be empty')
            }
            if(content.trim() === '') {
                throw new Error('Content cannot be empty')
            }
            if(category === '') {
                throw new Error('Pick a category')
            }

            if (!mongoose.Types.ObjectId.isValid(category)) {
                throw new Error('Invalid category ID');
              }

            const cat = await Category.findById(category)

            const newPost = new Post({
                title,
                content,
                category: cat.name,
                user: user.id,
                username: user.username,
                createdAt: new Date().toISOString()
            })
            const post = await newPost.save()

            return post
            // if (!image) {
            //     throw new Error('Image is required')
            // }

            // destructuring image 
            // const { filename, createReadStream } = await image

            // try {
            //     const stream = createReadStream()
            //     const result = await new Promise((resolve, reject) => {
            //         const cloudinaryStream = cloudinary.uploader.upload_stream(
            //             {folder: 'posts'},
            //             (error, result) => {
            //                 if(error) reject(error)
            //                 else resolve(result)
            //             }
            //         )
            //         stream.pipe(cloudinaryStream)
            //     })
    
            //     const newPost = new Post({
            //         title,
            //         content,
            //         category,
            //         // imageUrl: result.secure_url,
            //         user: user.id,
            //         username: user.username,
            //         createdAt: new Date().toISOString()
            //     })
            //     const post = await newPost.save()
    
            //     return post

            // } catch (error) {
            //     throw new Error('Error uploading images')
            // }


        },

        deletePost: async (_, {postId}, context) => {
            const user = validateAuth(context)

            try {
                const post = await Post.findById(postId)
                if(user.username === post.username) {
                    await post.deleteOne()
                    return post
                } else {
                    throw new GraphQLError('Actions not allowed', {
                        extensions: {
                            code: 'GRAPHQL_VALIDATION_FAILED',
                            error
                        }
                    })
                }
            } catch (error) {
                throw new Error(error)
            }
        }, 

    }
}