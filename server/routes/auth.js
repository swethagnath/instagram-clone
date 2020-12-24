const express = require('express')
const router  = express.Router()
const mongoose = require('mongoose')
const User     = mongoose.model('User')
const bcryptjs   = require('bcryptjs')
const jwt      = require('jsonwebtoken')
const {JWT_SECRET} = require('../keys')

router.post('/signup', (req, res) => {

    const {name, email, password, pic} = req.body
    if(!email || !password || !name){
        return res.status(422).json({err: "please add all the fields"})
    }
    User.findOne({email})
        .then(savedUser => {
            if(savedUser) return res.status(422).json({error: "user already exists with that email"})
            bcryptjs.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email,
                        password: hashedPassword,
                        name, 
                        pic
                    })
                    user.save()
                    .then(user => {
                        res.json({message: "saved successfully"})
                    })
                    .catch(err => console.log(err))
                })
        })
        .catch(err => console.log(err))
        
})

router.post('/signin', (req, res) => {

    const {email, password} = req.body

    console.log('email',email, password)

    if(!email || !password) return res.json({error: "please add email or password"})

    User.findOne({email})
    .then(savedUser => {
        if(!savedUser) return res.json({error: "please add email"})
        bcryptjs.compare(password, savedUser.password)
        .then(doMatch => {
            if(doMatch){
                const token = jwt.sign({_id: savedUser._id}, JWT_SECRET)
                const {_id, name, email, followers, following, pic} = savedUser
                return res.json({token, user: {_id, name, email, followers, following, pic}, message: "successfully signed in"})
            }else{
                return res.json({error: "please password"})
            }
        })
    })
    .catch(err => console.log(err))
    
})

module.exports = router