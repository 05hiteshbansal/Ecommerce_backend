const mongoose =require('mongoose')

const dbconnect=()=>{
mongoose.connect(process.env.MONGODB_URL)
.then(()=>{
console.log("connected successfully")
})

.catch((error)=>{
    console.log("some error occured")
    console.log(error);
})
}


module.exports=dbconnect