const express = require('express')
const router  = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middlewares/requireLogin')
const Post = mongoose.model('Post')
const {ObjectId}       = mongoose.Schema.Types

router.get('/allpost', requireLogin, (req, res) => {
    console.log("all posts")
    Post.find()
    .populate("postedBy", "_id name")
    .populate("comments.postedBy", "name")
    .then(posts => {
        res.json({posts})
    })
    .catch(err => {
        console.log(err)
    })
})

router.post('/createpost', requireLogin, (req, res) => {
    const {title, body,photo} = req.body

    if(!title || !body || !photo){
        return res.status('422').json({"error": "Please add all the fields"})
    }
    
    req.user.password = undefined

    const post = new Post({
        body,
        title,
        photo,
        postedBy: req.user
    })
    post.save()
    .then(result => res.json({post: result}))
    .catch(err => console.log(err))
})

router.get('/mypost', requireLogin, (req, res) => {
    Post.find({postedBy: req.user._id})
    .populate("postedBy", "_id name")
    .then(mypost => {
        res.json({mypost})
    })
    .catch(err => console.log(err))
})

router.put('/unlike', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {$pull: {likes: req.user._id}}, {new: true})
    .then(post => {
        if(post){
            return res.json(post)
            
        }else{
            return res.json({error: "err"})
        }
    })
    .catch(err => console.log(err))
})

router.put('/like', requireLogin, (req, res) => {
    Post.findByIdAndUpdate(req.body.postId,  {$push:{likes: req.user._id}}, {new: true})
    .then(result =>{
        if(result){
            return res.json(result)
        }else{
            return res.json({error: "err"})
        }
    })
    .catch(err => console.log(err))
})

router.put('/comments', requireLogin, (req, res) => {
    const comment  = {
        text: req.body.text,
        postedBy: req.user._id
    }

    Post.findByIdAndUpdate(req.body.postId,  {$push:{comments: comment}}, {new: true})
    .populate("comments.postedBy", "name")
    .populate("postedBy", "_id, name")
    .then(result =>{
        if(result){
            console.log(result.postedBy)
            return res.json(result)
        }else{
            return res.json({error: "err"})
        }
    }) 
    .catch(err => console.log(err))
})

module.exports = router