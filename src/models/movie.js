const validator = require('validator')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    rating: {
        type: String,
        required: true,
        trim: true
    },
    overview: {
        type: String,
    },
    imageUrl: {
        type: String
    }
})

const Movie = mongoose.model('Movie', movieSchema)

module.exports = User