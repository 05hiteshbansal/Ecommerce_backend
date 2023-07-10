const bigpromise = require("../middleware/big_promise");
const stripe = require("stripe")(process.env.STRIPE_SECRET);



exports.sendStripeKey = bigpromise(async (req,res,next)=>{
    res.status(200).json({
        stripeKey : process.env.STRIPE_KEY
    });
})


exports.captureStripePayment = bigpromise(async (req,res,next)=>{
    
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "inr",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata : {integration_check : 'accept'}
      });

      res.status(200).json({
        success: "true",
        client_secreat : paymentIntent
      })

})


exports.sendRazorPayKey = bigpromise(async (req,res,next)=>{
    res.status(200).json({
        razorPayKey : process.env.RAZORPAY_KEY
    });
})

exports.captureRazorPayPayment = bigpromise(async (req,res,next)=>{
    
    var instance = new Razorpay({ 
        key_id: process.env.RAZORPAY_KEY, 
        key_secret: process.env.RAZORPAY_SECRET 
    })

const order = instance.orders.create({
  amount: req.body.amount,
  currency: "INR",
  receipt: "receipt#1 ",
  notes: {
    key1: "value3",
    key2: "value2"
  }
})
      res.status(200).json({
        success: "true",
        order : order
      })

})