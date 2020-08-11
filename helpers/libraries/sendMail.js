const nodeMailer = require("nodemailer");

const sendMail= async(mailOptions)=>{
    let transporter = nodeMailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        auth:{
            user:process.env.SMTP_USER,
            pass:process.env.SMTP_PASS
        }
    });
    
let info =await transporter.sendMail(mailOptions);
console.log(`Message Sent:${info.messageId}`);
}

module.exports=sendMail
