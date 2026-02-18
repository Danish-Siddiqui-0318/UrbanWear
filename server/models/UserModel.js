var mongoose = require('mongoose')
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// const phoneRegex = /^03[0-9]{9}$/;


var userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter your name.']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email.'],
        unique: [true, "email should be unique."],
        lowercase: [true, "email should be lowercase."],
        trim: true,
        match: [emailRegex, "Email should be valid."]
    },
    // phone: {
    //     type: String,
    //     required: [true, 'Phone number is required.'],
    //     unique: true,
    //     match: [phoneRegex, "Must be a valid number."]
    // },
    password: {
        type: String,
        required: [true, 'password is required'],
        trim: true,
        minLength: 6
    },
    isActive: {
        type: String,
        enum: ['active', 'suspended'],
        default: 'active'
    }
})

const UserModel = mongoose.model("Users", userSchema);