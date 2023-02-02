const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
        trim: true,
    },
    password: {
        type: String,
        require: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    address: {
        type: String,
        require: true,
        trim: true,
    },
    role: {
        type: Number,
        default: 0,
    },
    cart: {
        type: Array,
        default: []
    }
}, {
    timestamps: true,
})

module.exports = mongoose.model('Users', userSchema)