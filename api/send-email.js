// Vercel Serverless Function for SMTP Email
// This file should be placed in: api/send-email.js

const nodemailer = require('nodemailer');

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        // Parse request body
        const { name, email, message, to, from, subject, html, replyTo } = req.body;
        
        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields',
                errors: ['Name, email, and message are required']
            });
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email format',
                errors: ['Please enter a valid email address']
            });
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

        return res.status(200).json({
            success: true,
            message: 'Message sent successfully!',
            messageId: info.messageId
        });

    } catch (error) {
        console.error('Error sending email:', error);
        
        return res.status(500).json({
            success: false,
            message: 'Failed to send message. Please try again.',
            error: error.message
        });
    }
}

// Default email template
function createDefaultTemplate(name, email, message) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Portfolio Contact Form</title>
        <style>
            body {
                font-family: 'Poppins', Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                margin: 0;
                padding: 0;
                background: linear-gradient(135deg, #ff6b6b, #ffa726);
            }
            .email-container {
                max-width: 600px;
                margin: 20px auto;
                background: white;
                border-radius: 15px;
                overflow: hidden;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
            }
            .header {
                background: linear-gradient(135deg, #ff6b6b, #ffa726);
                color: white;
                padding: 30px;
                text-align: center;
            }
            .header h1 {
                margin: 0;
                font-size: 24px;
                font-weight: 600;
            }
            .content {
                padding: 30px;
            }
            .field {
                margin-bottom: 20px;
                padding: 15px;
                background: #f8f9fa;
                border-radius: 10px;
                border-left: 4px solid #ff6b6b;
            }
            .field-label {
                font-weight: 600;
                color: #ff6b6b;
                margin-bottom: 8px;
                font-size: 14px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            .field-value {
                color: #333;
                font-size: 16px;
            }
            .message-content {
                background: white;
                padding: 20px;
                border-radius: 10px;
                border: 1px solid #e9ecef;
                white-space: pre-wrap;
                font-family: inherit;
            }
            .footer {
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #666;
                font-size: 12px;
            }
            .footer p {
                margin: 5px 0;
            }
            .reply-button {
                display: inline-block;
                background: linear-gradient(135deg, #ff6b6b, #ffa726);
                color: white;
                padding: 12px 24px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: 600;
                margin-top: 15px;
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <h1>🌅 New Portfolio Contact</h1>
            </div>
            <div class="content">
                <div class="field">
                    <div class="field-label">Name</div>
                    <div class="field-value">${escapeHtml(name)}</div>
                </div>
                <div class="field">
                    <div class="field-label">Email</div>
                    <div class="field-value">
                        <a href="mailto:${email}" style="color: #ff6b6b; text-decoration: none;">
                            ${escapeHtml(email)}
                        </a>
                    </div>
                </div>
                <div class="field">
                    <div class="field-label">Message</div>
                    <div class="message-content">${escapeHtml(message)}</div>
                </div>
                <div style="text-align: center;">
                    <a href="mailto:${email}" class="reply-button">Reply to Sender</a>
                </div>
            </div>
            <div class="footer">
                <p><strong>Portfolio Contact Form</strong></p>
                <p>This message was sent from your portfolio website</p>
                <p>Received on ${new Date().toLocaleString()}</p>
            </div>
        </div>
    </body>
    </html>
    `;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}