
const typeDefs = `

    type Category {
        id: ID!
        name: String!
    }

    type Post {
        id: ID!
        title: String!
        content: String!
        chapter: String!
        author: String!
        category: String!
        imageUrl: String!
        username: String!
        createdAt: String!
    }

    type User {
        id: ID!
        username: String!
        token: String!
        createdAt: String!
    }
    
    input PostInput {
        title: String!
        content: String!
        chapter: String!
        author: String!
        category: ID!
        image: String!
    }

    input RegisterInput {
        username: String!
        password: String!
        confirmPassword: String!
    }

    scalar Upload

    type Query {

        getCategories: [Category]

        getPosts: [Post]
        getPost(postId: ID!): Post!

    }
    
    type Mutation {
        register(registerInput: RegisterInput):  User!
        login(username: String!, password: String!):  User!
        
        createCategory(name: String!): Category!

        createPost(postInput: PostInput): Post!
        deletePost(postId: ID!): Post!

    }

`

module.exports = typeDefs