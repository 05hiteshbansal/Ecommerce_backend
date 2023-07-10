const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt=require("bcryptjs")
const jwt=require('jsonwebtoken')
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
    type: String,
    required: [true, "provide a name"],
    maxlength: [40, "name should be under 40 characters"]
  },

  email: {
    type: String,
    required: [true, "provide a email"],
    validate: [
      validator.isEmail,
      "please provide a correct email in email format",
    ],
    unique: true
  },

  password: {
    type: String,
    required: [true, "provide a password"],
    maxlength: [40, "Please provide a password of 6 characters"],
    select: false
  },

  role: {
    type: String,
    default: "user"
},

photo: {
    id: {
      type: String,
     required: true
    },
    Secure_url: {
      type: String,
      required: true
    },
  },

  forgotPasswordToken: { type: String },
  forgotPasswordExpire: { type: Date },

  createdAt: {
    type: Date,
    default: Date.now,
},
});



// encrypt password before saveing it
// lifecycle events it is a hook 
userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        return next();
    }
    this.password= await bcrypt.hash(this.password,10)
})
userSchema.methods.isValidatePassword =async function(uesrsendPassword){
 return await bcrypt.compare(uesrsendPassword,this.password)
}
// create and return JWT token
userSchema.methods.getJWTToken=function(){
  return jwt.sign({id: this._id},process.env.JWT_SECRET,{expiresIn : process.env.JWT_EXPIRE})
}

// generate forgot password token 

userSchema.methods.getPasswordToken = function(){
  // generate a long random string  by nano id or randomstring pakkage 
  const forgotPassword= crypto.randomBytes(20).toString('hex');
// we are getting a hash 
this.forgotPasswordToken=crypto.createHash('sha256').update(forgotPassword).digest('hex')


console.log(crypto.createHash('sha256').update(forgotPassword).digest('hex'))
// time of token

this.forgotPasswordExpire=Date.now() + 20*60*1000
console.log(forgotPassword)
return forgotPassword
}


module.exports = mongoose.model("users", userSchema);