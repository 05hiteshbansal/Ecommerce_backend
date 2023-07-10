require('dotenv').config();
const app=require("./app")
const dbconnect =require('./config/db')
const cloudinary=require('cloudinary')
// connectring cloudinary

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_NAME, 
    api_key:process.env.CLOUDINARY_KEY , 
    api_secret: process.env.CLOUDINARY_SECRET,
    secure: true
  });



dbconnect()
app.listen(4000,()=>{
    console.log("Server started ")
})