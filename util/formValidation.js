const mongoose = require('mongoose')

module.exports.validateFormInput = (
    title,
    content,
    category,
    image
) => {
    const errors = {}

    if(title.trim() === '') {
        errors.title = 'Title must not be empty'
    }

    if(content.trim() === '') {
        errors.content = 'Content must not be empty'
    }

    if(category === '') {
        errors.category = 'Category must not be empty'
    }

    if(image.trim() === '') {
        errors.image = 'Image must not be empty'
    }

    return { 
        errors,
        valid: Object.keys(errors).length < 1
    }
}