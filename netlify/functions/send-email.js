// Netlify Serverless Function for SMTP Email
// This file should be placed in: netlify/functions/send-email.js

const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
    // Handle CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Method not allowed'
            })
        };
    }

    try {
        // Parse request body
        const data = JSON.parse(event.body);
        
        // Validate required fields
        const { name, email, message, to, from, subject, html, replyTo } = data;
        
        if (!name || !email || !message) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Missing required fields',
                    errors: ['Name, email, and message are required']
                })
            };
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({
                    success: false,
                    message: 'Invalid email format',
                    errors: ['Please enter a valid email address']
                })
            };
        }

        // Create SMTP transporter
        const transporter = nodemailer.createTransporter({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT) || 587,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER || 'devarkondasneha@gmail.com',
                pass: process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD
            }
        });

        // Email options
        const mailOptions = {
            from: `${process.env.FROM_NAME || 'Portfolio Contact'} <${from || process.env.SMTP_USER}>`,
            to: to || process.env.TO_EMAIL || 'devarkondasneha@gmail.com',
            replyTo: replyTo || email,
            subject: subject || 'New message from your portfolio website',
            html: html || createDefaultTemplate(name, email, message),
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        
        console.log('Email sent successfully:', info.messageId);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: 'Message sent successfully!',
                messageId: info.messageId
            })
        };

    } catch (error) {
        console.error('Error sending email:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                message: 'Failed to send message. Please try again.',
                error: error.message
            })
        };
    }
};

// Default email template
function createDefaultTemplate(name, email, message) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ff6b6b, #ffa726); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { padding: 20px; background: #f9f9f9; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #555; }
            .value { margin-top: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>New Portfolio Contact</h1>
            </div>
            <div class="content">
                <div class="field">
                    <div class="label">Name:</div>
                    <div class="value">${escapeHtml(name)}</div>
                </div>
                <div class="field">
                    <div class="label">Email:</div>
                    <div class="value"><a href="mailto:${email}">${escapeHtml(email)}</a></div>
                </div>
                <div class="field">
                    <div class="label">Message:</div>
                    <div class="value">${escapeHtml(message).replace(/\n/g, '<br>')}</div>
                </div>
            </div>
            <div class="footer">
                <p>This message was sent from your portfolio contact form.</p>
                <p>Received on ${new Date().toLocaleString()}</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}