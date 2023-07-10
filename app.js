const express=require('express')
const morgan = require('morgan')
const cookieParser =require('cookie-parser')
const file_upload=require("express-fileupload")


// express middleware
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))


// cookies and file_uploads_middleware
app.use(cookieParser())
app.use(file_upload({
    useTempFiles: true,
    tempfiledir : '/tmp/'
}))


// morgan middleware
app.use(morgan('tiny'))




//import all routes here
const home=require('./routes/home')
const user=require('./routes/user')
const product = require('./routes/product')
const payment = require('./routes/payment.js')
const order = require('./routes/orders.js')






app.use('/api/v1',home)
app.use('/api/v1',user)
app.use('/api/v1',product)
app.use('/api/v1',payment)
app.use('/api/v1',order)

module.exports=app;