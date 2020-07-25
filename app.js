const express = require('express')
const app = express()
const { config }= require('dotenv')
config()
require('./db')

app.use(express.json())

const userApiRoutes = require('./routes/apiRoute')
app.use(userApiRoutes)

module.exports = app