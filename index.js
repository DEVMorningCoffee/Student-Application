const express = require('express')
require('dotenv').config()


const app = express()
const PORT = process.env.PORT || 5000


app.get('/', (req, res)=>{
    res.send('Home Page')
})

app.listen(PORT, ()=>{
    console.log(`You are listening on port: ${PORT}`)
})