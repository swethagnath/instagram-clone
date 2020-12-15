const express = require('express')
const app = express()
const PORT = 5000
const mongoose = require('mongoose')
const {MONGOURI} = require('./keys')
const cors = require('cors')

app.use(cors())

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Methods",
      "OPTIONS, GET, POST, PUT, PATCH, DELETE"
    );
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Expose-Headers", "Access-Token, Uid, x-auth");
    next();
});

require('./models/users')
require('./models/posts')

const auth = require('./routes/auth')
const post = require('./routes/post')

app.use(express.json())

app.use(auth)
app.use(post)

mongoose.connect(MONGOURI, { useUnifiedTopology: true })

mongoose.connection.on('connected', () => {
    console.log("connected to mongo")
})

mongoose.connection.on('error', err => {
    console.log("err connecting", err)
})

app.listen(PORT, () => (
    console.log('server is running', PORT)
))  