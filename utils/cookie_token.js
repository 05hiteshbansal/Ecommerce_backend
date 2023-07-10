const cookie_token=(user,res)=>{
    const token = user.getJWTToken()
    const options = {
      expire: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true
    };
  
    user.password=undefined
    console.trace( user.id)
    res.status(200).cookie("token" ,token, options).json({
      success: true,
      token,
      user
    }); 

}
module.exports=cookie_token