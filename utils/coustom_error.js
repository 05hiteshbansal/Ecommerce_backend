class CustomError extends Error{
 constructor(message ,code){
    super(message)
    this.code=code
 }
} 

module.exports = CustomError


// it is not used basically node error are full in themself
