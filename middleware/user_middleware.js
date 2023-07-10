const User = require("../models/user");
const BigPromise = require("./big_promise");
const CustomError = require("../utils/coustom_error");
const jwt = require("jsonwebtoken");

exports.isLoggedIn = BigPromise(async (req, res, next) => {
  const token = req.cookies.token || req.header("Autherization");

  if (!token) {
    return next(new CustomError("Login in to access the token", 401));
  }

  const value = jwt.verify(token, process.env.JWT_SECRET);

  //console.log(value , 1);
  req.user = await User.findById(value.id);
  //console.log(req.user , "lol")
  next();
});


exports.isAdmin = (...roles)=>{
return (req,res,next)=>{
    if(!roles.includes(req.user.role)){
return next(new CustomError("Not authorized to access",400))
    }
    next()
}

}