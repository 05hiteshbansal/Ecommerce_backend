const express = require("express");
const router = express.Router();
const { isLoggedIn, isAdmin } = require("../middleware/user_middleware");
const { sendRazorPayKey , sendStripeKey , captureStripePayment , captureRazorPayPayment} = require('../controllers/payment_Controller')

router.route("/stripekey").get( isLoggedIn, sendStripeKey);
router.route("/razorpaykey").get(isLoggedIn ,sendRazorPayKey);

router.route("/razorPay/payment").post(isLoggedIn ,captureRazorPayPayment)
router.route("/stripe/payment").post(isLoggedIn ,captureStripePayment)






module.exports = router;