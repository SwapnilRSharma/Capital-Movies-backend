const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value){
            if(!validator.isEmail(value)) throw new Error('Invalid email id.')
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    favourites: [
        {name: {
            type: String,
            required: true,
            trim: true,
        },
        rating: {
            type: String,
            trim: true
        },
        overview: {
            type: String,
        },
        imageUrl: {
            type: String
        }}
    ]
})

userSchema.methods.generateAuthToken = async function () {
    const user = this

    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET)

    return token
}

userSchema.statics.findByCredentials = async (email, password) => {
    
    const user = await User.findOne({ email })

    if (!user) {
        throw new Error('Unable to login.')
    }

    const isMatch = await bcrypt.compare(password, user.password)


    if (!isMatch) {
        throw new Error('Unable to login.')
    }
    return user
}

userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }

    next()
})

const User = mongoose.model('User', userSchema)

module.exports = User