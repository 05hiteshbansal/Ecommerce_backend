const express=require('express')
const router=express.Router()
const {home,homeDummy}=require("../controllers/home_controller")


router.route('/').get(home)
router.route('/dummy').get(homeDummy)



module.exports=router