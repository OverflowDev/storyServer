module.exports.validateRegisterInput = (
    name,
    username,
    password,
    confirmPassword
) => {
    const errors = {}

    if(name.trim() === '') {
        errors.name = 'Name must not be empty'
    }

    if(username.trim() === '') {
        errors.username = 'Username must not be empty'
    }else {
        const hasSpace = username.indexOf(' ') !== -1;
        if (hasSpace) {
        errors.username = 'Username cannot contain spaces';
        }
    }

    if(password === ''){
        errors.password = 'Password must not be empty'
    } else if(password !== confirmPassword) {
        errors.password = 'Password must match'
    }

    return { 
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validateLoginInput = (
    username,
    password,
) => {
    const errors = {}

    if(username.trim() === '') {
        errors.username = 'Username must not be empty'
    }

    if(password === ''){
        errors.password = 'Password must not be empty'
    }

    return { 
        errors,
        valid: Object.keys(errors).length < 1
    }
}