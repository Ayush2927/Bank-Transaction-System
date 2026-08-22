import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});

// Verify the connection configuration
transporter.verify((error, success) => {
    if (error) {
        console.error('Error connecting to email server:', error);
    } else {
        console.log('Email server is ready to send messages');
    }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"Bank-Transaction" <${process.env.EMAIL_USER}>`, // sender address
            to, // list of receivers
            subject, // Subject line
            text, // plain text body
            html, // html body
        });

        console.log('Message sent: %s', info.messageId);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

async function sendRegistrationMail(userEmail, name) {
    const subject = 'Welcome to Bank Transaction System'
    const text = `hello ${name}, \n\n Thank you for registering at Bank Transaction System. We are excited to have you on board!</p><p> Best regards, <br> The Backend Ledger team</p>`;
    const html = `<p>hello ${name},</p><p> Thank you for registering at Bank Transaction System. We are excited to have you on board!</p><p> Best regards, <br> The Backend Ledger team</p>`;
    await sendEmail(userEmail, subject, text, html);
}

async function sendtransactionMail(userEmail, name, amount, toAccount) {
    const subject = `Transaction Successful`;
    const text = `Hello ${name}, \n\n Your transaction of ${amount} to account ${toAccount} has been processed successfully.\n\n Best regards, \n The Backend Ledger team`;
    const html = `<p>Hello ${name},</p><p> Your transaction of ${amount} to account ${toAccount} has been processed successfully.</p><p> Best regards, <br> The Backend Ledger team</p>`;
    await sendEmail(userEmail, subject, text, html);
}

async function sendtransactionFailureMail(userEmail, name, amount, toAccount) {
    const subject = 'Transaction Failed';
    const text = `Hello ${name}, \n\n Your transaction of ${amount} to account ${toAccount} has failed to process.\n\n Best regards, \n The Backend Ledger team`;
    const html = `<p>Hello ${name},</p><p> Your transaction of ${amount} to account ${toAccount} has failed to process.</p><p> Best regards, <br> The Backend Ledger team</p>`;
    await sendEmail(userEmail, subject, text, html);
}

async function sendOTPMail(userEmail, name, otp) {
    const subject = "Your 2FA Verification Code";
    const text = `Hello ${name},\n\nYour 6-digit 2FA verification code is: ${otp}\nThis code will expire in 10 minutes.\n\nBest regards,\nThe Backend Ledger team`;
    const html = `<p>Hello ${name},</p><p>Your 6-digit 2FA verification code is: <h2 style="color: #2563eb; letter-spacing: 4px;"><strong>${otp}</strong></h2></p><p>This code will expire in 10 minutes.</p><p>Best regards,<br>The Backend Ledger team</p>`;

    await sendEmail(userEmail, subject, text, html);
}

export { sendRegistrationMail, sendtransactionMail, sendtransactionFailureMail, sendOTPMail };


