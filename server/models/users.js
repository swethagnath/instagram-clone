const mongoose = require('mongoose')
const {ObjectId}       = mongoose.Schema.Types

const userSchema = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }, 
    followers:[{type: ObjectId, ref: "User"}],
    following: [{type: ObjectId, ref: "User"}],
    pic: {
        type: String,
        default: 'https://res.cloudinary.com/dfbwza244/image/upload/v1596739515/gnu6rt2bdw5navfng2r2.jpg'
    }
    
})

mongoose.model("User", userSchema)