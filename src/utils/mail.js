import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
//the main sender object
const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
});
//the recipient of the email being sent
async function sendMail(to, sub, msg) {
   await transporter.sendMail({
        from: process.env.EMAIL_USER, to: to, subject: sub, html: msg });
    console.log("Email sent")
};

sendMail("sophiahumphreyu@gmail.com", "Test email", "<p>It workedddddd!!!!</p>");

export default sendMail;