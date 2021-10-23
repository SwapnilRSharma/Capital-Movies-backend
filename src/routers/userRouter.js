const express = require('express')
const router = new express.Router()
const Joi = require('joi')
const User = require('../models/user')
const axois = require('axios')
const { default: axios } = require('axios')
const auth = require('../middleware/auth')

const API_link = process.env.API_LINK + process.env.API

//GET /movies?sortBy=popularity.desc
router.get('/movies', async(req, res) => {
    try{
        const sort = req.query.sort_by;
        let url = process.env.BASE_URL + 'discover/movie?api_key=1be7dfda0d22e850b70add1f5d6ed771';
        if(sort != 'none') {
            url = url + '&sort_by=' + sort + '.desc'
        }
        console.log(url)
        const response = await axios.get(url)
        
        // console.log(movies)
        if(response.status != 200){
            console.log(response)
            return res.status(500).send(response.statusText)

        }
        
        return res.send(response.data);
    }catch(e){
        console.log(e)
        return res.status(400).send({"message:" : "Internal error occurred."})
    }
})

router.post('/add-to-fav', auth, async(req, res) => {
    try{
        req.user.favourites.push({name: req.body.name, rating: req.body.rating, overview: req.body.overview, imageUrl: req.body.imageUrl})
        await req.user.save()
        return res.status(200).send()
    }catch(e){
        console.log(e)
        return res.status(400).send({message: "Internal error occurred."})
    }
})

router.get('/fav', auth, async(req, res) => {
    try{
        return res.status(200).send(req.user.favourites)
    }catch(e){
        console.log(e)
        return res.status(400).send({message: "Internal error occurred."})
    }
})

router.post('/remove-to-fav', auth, async(req, res) => {
    try{
        req.user.favourites = req.user.favourites.filter((fav)=> fav.name != req.body.name)
        await req.user.save()
        return res.status(200).send(req.user.favourites)
    }catch(e){
        console.log(e)
        return res.status(400).send({message: "Internal error occurred."})
    }
})

router.post('/login', async(req, res) => {
    try {
        console.log(req.body)
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send({
            status: 'error',
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

        const user = new User({name: req.body.name, email: req.body.email, password: req.body.password})
        await user.save()
        const token = user.generateAuthToken()

        res.status(200).send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send({
            status: 'error',
            message: e.message
        })
    }
})

module.exports = router