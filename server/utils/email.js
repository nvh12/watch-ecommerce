require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

function mail(name, code, email) {
    return {
        from: process.env.EMAIL,
        to: email,
        subject: 'Account recovery',
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Hello ${name},</h2>
                <p>You requested to recover your account. Please use the following code:</p>
                <div style="font-size: 1.5em; font-weight: bold; margin: 10px 0;">${code}</div>
                <p>If you didn’t request this, you can ignore this email.</p>
                <p>Thanks,<br/>Watch Store</p>
            </div>
        `
    }
}

function send(name, code, email) {
    const option = mail(name, code, email);
    transporter.sendMail(option, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = { send };