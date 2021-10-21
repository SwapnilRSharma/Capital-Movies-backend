const express = require('express')
const router = new express.Router()
const Joi = require('joi')

router.get('/movies', async(req, res) => {
    return res.send("Get movies");
})

router.get('/movie', async(req, res) => {
    return res.send("Get movie details")
})

router.post('/add-to-fav', async(req, res) => {
    return res.send("Add to fav")
})

router.post('/remove-to-fav', async(req, res) => {
    return res.send("Remove from fav")
})

router.get('/login', async(req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send({
            status: error,
            message: e.message
        })
    }
})

router.post('/register', async(req, res) => {
    try {
        const schema = Joi.object({
            name: Joi.string().min(2).max(255).required(),
            email: Joi.string().email().min(5).max(255).required(),
            password: Joi.string().min(5).max(1024).required(),
        })

        const result = schema.validate(req.body)
        if (result.error) return res.status(400).send({ error: result.error.details[0].message })

        const isExist = await User.findOne({ email: req.body.email })
        if(isExist) return res.status(401).send({message: "Email id already used."})

        const user = new User(name, email, password)
        await user.save()
        const token = user.generateAuthToken()

        res.status(200).send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send({
            status: error,
            message: e.message
        })
    }
})

module.exports = router