require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Resend } = require('resend');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const resend = new Resend(process.env.RESEND_API_KEY);

const app = express();
app.use(bodyParser.json({ limit: '1mb' }));

// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? ['https://your-production-domain.com'] : ['http://127.0.0.1:5500'],
    allowedHeaders: ['Content-Type']
}));

// Rate limiting
const emailRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs
    message: 'Too many requests, please try again later'
});
app.use('/send-email', emailRateLimiter);

// Email validation
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Base64 image validation
const validateBase64Image = (base64) => /^data:image\/(png|jpeg|jpg);base64,[A-Za-z0-9+/=]+$/.test(base64);

app.post('/send-email', async (req, res) => {
    const { email, image } = req.body;

    if (!validateEmail(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    if (!validateBase64Image(image)) {
        return res.status(400).json({ success: false, message: 'Invalid image format' });
    }

    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Your Income-Expenses Chart',
            html: '<p>Here is your income-expenses chart:</p>',
            attachments: [
                {
                    filename: 'chart.png',
                    content: image.split('base64,')[1],
                    encoding: 'base64'
                }
            ]
        });

        res.json({ success: true });
    } catch (error) {
        console.error('Error sending email:', error.message);
        res.status(500).json({ success: false, message: 'An internal server error occurred' });
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});