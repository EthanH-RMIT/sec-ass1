const express = require('express');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const cors = require("cors")
const speakeasy = require('speakeasy');
const qrcode = require('qrcode');

dotenv.config();

const app = express();
app.use(express.json());

let totpSecret; // Store the TOTP secret globally for simplicity


app.use(cors({
    origin: 'http://localhost:3001', // Replace with your frontend URL
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization'
}));

const users = {}; // For simplicity, using an in-memory store for users

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail', // You can use other email services
    auth: {
        user: "hohethan4@gmail.com",
        pass: "hwrsagtpskqpvdbx"
    },
});

// Endpoint to initiate login
app.post('/login', async (req, res) => {
    const { email } = req.body;
    const code = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit code

    // Save the code to the user's record
    users[email] = { code, verified: false };

    // Send the 2FA code via email using Nodemailer
    const mailOptions = {
        from: "hohethan4@gmail.com",
        to: email,
        subject: 'Your 2FA Code',
        text: `Your need to provide the following code to login: /n ${code}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send('Error sending email');
        }
        res.status(200).send('2FA code sent to email.');
    });
});

// Endpoint to verify 2FA code
app.post('/verify', (req, res) => {
    const { email, code } = req.body;
    const user = users[email];
    console.log("The Code sent is", code)
    console.log("User:", user)

    if (user.code == code) {
        user.verified = true;
        res.json({ message: 'You have entered 2FA secret code correctly. Login Succesful!' });
    } else {
        res.status(401).send('You have entered the Wrong 2FA secret code. Login Failed!');
    }
});

app.post('/generate-qr', async (req, res) => {
    // Generate TOTP secret
    totpSecret = speakeasy.generateSecret({ name: `MyApp` });

    // Generate QR code URL
    const qrCodeUrl = await qrcode.toDataURL(totpSecret.otpauth_url);

    res.status(200).json({ qrCodeUrl });
});

app.post('/verify-totp', (req, res) => {
    const { totpCode } = req.body;

    const verified = speakeasy.totp.verify({
        secret: totpSecret.base32,
        encoding: 'base32',
        token: totpCode,
    });

    if (verified) {
        res.json({ message: 'Code verified successfully!', success: true });
    } else {
        res.status(401).json({ message: 'Invalid code.', success: false });
    }
});

app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
