const nodemailer = require("nodemailer")
require("dotenv").config();

const SMTP_EMAIL = process.env.SMTP_EMAIL || 'jigentech2021@gmail.com'
const SMTP_PASSWORD = process.env.SMTP_PASSWORD || 'kumpazdnyzelhmim'

const SendMail = (data) => {

    let { recipientEmail, subject, content, ccArr, bccArr, attachments } = data
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: SMTP_EMAIL,
            pass: SMTP_PASSWORD
        }
    });
    const mailOptions = {
        from: "onepointcorp@gmail.com",
        to: recipientEmail,//email of user
        subject: subject || "One Point Scaffolding Pvt. Ltd.",
        html: content || '<h1>Email Notification</h1>',
        priority: 'high',
    }
    if (ccArr && ccArr?.length > 0) mailOptions.cc = ccArr
    if (bccArr && bccArr?.length > 0) mailOptions.bcc = bccArr
    if (attachments && attachments?.length > 0) mailOptions.attachments = attachments

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error:', error);
        } else {
            console.log('Email sent:', recipientEmail, info.response);
        }
    });
}
module.exports = SendMail;

/**
{
    "recipientEmail": "kunal.86agency@gmail.com",
    "client_name": "Kunal",
    "template": 1,
    "subject":"Test EMail",
    "ccArr":["kunalmehra240304@gmail.com"],
    "bccArr":["kunalmehra240304@gmail.com"],
    "attachments": [
       {
           "filename": "Quotation.pdf",
           "path": "https://www.africau.edu/images/default/sample.pdf"
       }
   ]
} 
*/