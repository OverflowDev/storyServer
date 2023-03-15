const usersResolvers = require('./users')
const postsResolvers = require('./posts')
const categoriessResolvers = require('./categories')

module.exports ={

    Query: {
        ...postsResolvers.Query,
        ...categoriessResolvers.Query
    },

    Mutation: {
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...categoriessResolvers.Mutation

    }
    
}