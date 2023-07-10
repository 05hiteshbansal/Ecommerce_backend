const express =require('express')
const router = express.Router()

const {signup , login,logout, forgotPassword , forgotReset,userDetail, changePassword ,adminAllUser,managerAllUser, adminOneUser} = require('../controllers/user_controller')
const { isLoggedIn, isAdmin } = require('../middleware/user_middleware')


router.route('/signup').post(signup)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/forgotPassword').post(forgotPassword)
router.route('/password/reset/:token').post(forgotReset)
router.route('/userDashboard/updatePassword').post( isLoggedIn, changePassword )
router.route('/userDashboard').get( isLoggedIn, userDetail)
router.route('/admin').get(isLoggedIn,isAdmin("admin"),adminAllUser)
router.route('/manager').get(isLoggedIn,isAdmin("manager"),managerAllUser)
router.route('/admin/user/:id').get(isLoggedIn,isAdmin("admin"),adminOneUser)










module.exports=router