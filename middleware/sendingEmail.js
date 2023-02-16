// nodemailer is required for this portion
// first i will configure everything using mailtrap.io and then connect it to the outlook

const nodemailer = require('nodemailer')


var transport = nodemailer.createTransport({ 
  service:"gmail",
  auth: {

    user: "businesstester945@gmail.com",
    pass: "shfyjflsblebmcci"
  

}
    // host: "smtp.mailtrap.io",
    // this will be changed to outlook or gmail in the later stages
    // port: 2525,
    // auth: {

        
    //   // user: "97aa5afcf599b8",
    //   // pass: "3b3530fdce218e"

    //   user: "outlook_44EE0485EE9711CD@outlook.com",
    //   pass: "Sunrise111!"
    
    // }
  });

  const sendingEmail = async(mailOptions)=>{
    let info = await transport.sendMail({
        from:mailOptions.from,
        to:mailOptions.to,
        subject:mailOptions.subject,
        text:mailOptions.text,
        html:mailOptions.html
    })
  }

//   next is the exporting of the module 
module.exports = sendingEmail