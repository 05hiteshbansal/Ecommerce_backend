const bigpromise=require('../middleware/big_promise')




exports.home=bigpromise(async(req,res)=>{
    res.status(200).json({
        success: true,
        done:"Hello"
    })
})

exports.homeDummy=(req,res)=>{
    res.status(200).json({
        success: true,
        done:"this is Dummy version"
    })
}