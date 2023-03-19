const { GraphQLError } = require('graphql')
const mongoose = require('mongoose')

const Post = require('../../models/Post')
const Category = require('../../models/Category')

const validateAuth = require('../../util/authValidation')
const {validateFormInput} = require('../../util/formValidation')

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

        createPost: async (_, {postInput: {title, content, chapter, category, image}}, context) => {
            const user = validateAuth(context)

            // validate form 
            if (title.trim() === '' || content.trim() === '' || category === '' || chapter === '' || image.trim() === '') {
                throw new Error('Post title, content, category, chapter and image must not be empty')
            }

            // destructuring image 
            // const { createReadStream, filename, mimetype } = await image

            if (!mongoose.Types.ObjectId.isValid(category)) {
                throw new Error('Invalid category ID');
            }

            const cat = await Category.findById(category)

            // const stream = createReadStream()

            // const allowedTypes = ['image/jpeg', 'image/png'];
            // if (!allowedTypes.includes(mimetype)) {
            //     throw new Error(`Invalid file type. Allowed types are: ${allowedTypes.join(', ')}`);
            // }

            // const maxSize = 10 * 1024 * 1024; // 10 MB
            // if (stream.bytesRead > maxSize) {
            //     throw new Error(`File size exceeds maximum limit of ${maxSize / (1024 * 1024)} MB`);
            // }

            const uploadOptions = {
                folder: 'posts',
                resource_type: 'auto',
              };

            try {
                const res = await cloudinary.uploader.upload(image, uploadOptions)

                const newPost = new Post({
                    title,
                    content,
                    chapter,
                    username: user.username,
                    category: cat.name,
                    imageUrl: (await res).secure_url,
                    user: user.id,
                    createdAt: new Date().toISOString()
                })

                const post = await newPost.save()
                return post

            } catch (error) {
                console.error(error);
                throw new Error('Failed to upload file to Cloudinary');
            }

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