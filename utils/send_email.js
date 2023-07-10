const nodemailer= require('nodemailer')

const mail=async(info)=>{
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
});


// async..await is not allowed in global scope, must use a wrapper




const options={
    
        from: '5555.rakesh.cool@gmail.com', // sender address
        to: info.to, // list of receivers
        subject: info.subject, // Subject line
        text: info.message
}




// send mail with defined transport object
  const y= await transporter.sendMail(options);

  console.log("Message sent: %s", y.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //


}

module.exports=mail