const express = require('express')
const router  = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')
const Post = mongoose.model('Post')
const User = mongoose.model('User')

router.get('/user/:id', requireLogin, (req, res) => {
    User.findOne({_id: req.params.id})
    .select("-password")
    .then(user => {
        Post.find({postedBy: req.params.id})
        .populate("postedBy", "_id name")
        .exec((err, post) => {
            if(err){
                return res.status(422).json({error: err})
            }else{
                console.log(post)
                return res.json({user, post})
            }
        })
    })
})

router.put('/follow', requireLogin,  (req, res) => {
    User.findByIdAndUpdate(req.body.followId, {$push: {followers: req.user._id}}, {new: true})
    .select('-password')
    .then(otherUser=>{
        User.findByIdAndUpdate(req.user._id, {$push: {following: req.body.followId}}, {new: true})
        .select('-password')
        .then(data => {
            res.json({data, otherUser})
        })
        .catch(err => res.status(422).json({err}))
    })
})

router.put('/unfollow', requireLogin,  (req, res) => {
    User.findByIdAndUpdate(req.body.unfollowId, {$pull: {followers: req.user._id}}, {new: true}, (err, result) => {
        if(err){
            return res.status(422).json({error: err})
        }
        User.findByIdAndUpdate(req.user._id, {$pull: {following: req.body.unfollowId}}, {new: true})
        .select('-password')
        .then(result => {
            res.json(result)
        })
        .catch(err => res.status(422).json({err}))
    })
})

router.put('/update', requireLogin, (req, res) => {
    User.findById(req.user._id)
    .then(user => {
        if(!!req.body.pic){
            user.pic = req.body.pic
            user.save()
            return res.status(422).json({user})
        }
    }) 
})

router.get('/users', (req, res) => {
    User.find()
    .select("_id, name")
    .then(user => res.json({user}))
    .catch(err => console.log(err))
})

module.exports = router