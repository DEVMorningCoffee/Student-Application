const express = require('express')
require('dotenv').config()


const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(express.urlencoded({extended: false}))
app.use(express.json())


app.get('/', (req, res)=>{
    res.send('Home Page')
})

app.use('/', require('./routes/loginPage'))

app.listen(PORT, ()=>{
    console.log(`You are listening on port: ${PORT}`)
})