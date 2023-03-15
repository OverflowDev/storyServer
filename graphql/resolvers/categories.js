const { GraphQLError } = require('graphql')

const Category = require('../../models/Category')

module.exports = {

    Query: {
        getCategories: async () => {
            try {
                const categories = await Category.find().sort({createdAt: -1})
                return categories
            } catch (error) {
                throw new Error(error)
            }
        }
    },

    Mutation: {
        createCategory: async(_, {name}) => {
            const category = new Category({ name });
            await category.save();
            return category;
        }
    }
}