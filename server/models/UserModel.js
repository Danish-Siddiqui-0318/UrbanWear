const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Admin name is required.']
    },
    email: {
        type: String,
        required: [true, 'Admin email is required.'],
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'Admin password is required'],
        trim: true
    },
    role: {
        type: String,
        default: 'admin',
        enum: ['admin']
    }
}, { timestamps: true });

const UserModel = mongoose.model("Users", userSchema);

module.exports = UserModel;
