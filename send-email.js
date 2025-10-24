// JavaScript SMTP Email Handler
// This can be used with serverless functions (Netlify, Vercel) or EmailJS

class EmailHandler {
    constructor(config) {
        this.config = {
            service: config.service || 'gmail',
            smtp: {
                host: config.smtp?.host || 'smtp.gmail.com',
                port: config.smtp?.port || 587,
                secure: config.smtp?.secure || false,
                auth: {
                    user: config.smtp?.auth?.user || 'devarkondasneha@gmail.com',
                    pass: config.smtp?.auth?.pass || ''
                }
            },
            to: config.to || 'devarkondasneha@gmail.com',
            from: config.from || 'devarkondasneha@gmail.com',
            subject: config.subject || 'New message from your portfolio website'
        };
    }

    // Validate email format
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Sanitize input to prevent XSS
    sanitizeInput(input) {
        const div = document.createElement('div');
        div.textContent = input;
        return div.innerHTML;
    }

    // Validate form data
    validateFormData(data) {
        const errors = [];
        
        if (!data.name || data.name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }
        
        if (!data.email || !this.validateEmail(data.email)) {
            errors.push('Please enter a valid email address');
        }
        
        if (!data.message || data.message.trim().length < 10) {
            errors.push('Message must be at least 10 characters long');
        }
        
        // Basic spam protection
        const spamKeywords = ['viagra', 'casino', 'lottery', 'winner', 'congratulations'];
        const messageLower = data.message.toLowerCase();
        for (const keyword of spamKeywords) {
            if (messageLower.includes(keyword)) {
                errors.push('Message contains inappropriate content');
                break;
            }
        }
        
        return errors;
    }

    // Create HTML email template
    createEmailTemplate(data) {
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
                        <div class="field-value">${this.sanitizeInput(data.name)}</div>
                    </div>
                    <div class="field">
                        <div class="field-label">Email</div>
                        <div class="field-value">
                            <a href="mailto:${data.email}" style="color: #ff6b6b; text-decoration: none;">
                                ${this.sanitizeInput(data.email)}
                            </a>
                        </div>
                    </div>
                    <div class="field">
                        <div class="field-label">Message</div>
                        <div class="message-content">${this.sanitizeInput(data.message)}</div>
                    </div>
                    <div style="text-align: center;">
                        <a href="mailto:${data.email}" class="reply-button">Reply to Sender</a>
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

    // Send email using EmailJS (client-side solution)
    async sendEmailWithEmailJS(data) {
        try {
            // Initialize EmailJS (you'll need to set this up)
            if (typeof emailjs === 'undefined') {
                throw new Error('EmailJS not loaded');
            }

            const templateParams = {
                from_name: data.name,
                from_email: data.email,
                message: data.message,
                to_email: this.config.to,
                reply_to: data.email
            };

            const response = await emailjs.send(
                'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
                'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
                templateParams,
                'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
            );

            return {
                success: true,
                message: 'Message sent successfully! I\'ll get back to you soon.',
                response: response
            };
        } catch (error) {
            console.error('EmailJS Error:', error);
            return {
                success: false,
                message: 'Failed to send message. Please try again.',
                error: error.message
            };
        }
    }

    // Send email using serverless function (Netlify/Vercel)
    async sendEmailWithServerless(data) {
        try {
            const response = await fetch('/.netlify/functions/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    to: this.config.to,
                    from: this.config.from,
                    subject: this.config.subject,
                    html: this.createEmailTemplate(data),
                    replyTo: data.email,
                    name: data.name,
                    email: data.email,
                    message: data.message
                })
            });

            const result = await response.json();
            
            if (response.ok) {
                return {
                    success: true,
                    message: 'Message sent successfully! I\'ll get back to you soon.',
                    data: result
                };
            } else {
                return {
                    success: false,
                    message: result.message || 'Failed to send message. Please try again.',
                    errors: result.errors
                };
            }
        } catch (error) {
            console.error('Serverless Function Error:', error);
            return {
                success: false,
                message: 'Network error. Please check your connection and try again.',
                error: error.message
            };
        }
    }

    // Main email sending method
    async sendEmail(data, method = 'serverless') {
        // Validate form data
        const validationErrors = this.validateFormData(data);
        if (validationErrors.length > 0) {
            return {
                success: false,
                message: 'Please correct the following errors:',
                errors: validationErrors
            };
        }

        // Rate limiting (using localStorage)
        const lastEmailTime = localStorage.getItem('lastEmailTime');
        const currentTime = Date.now();
        const rateLimitMs = 60000; // 1 minute

        if (lastEmailTime && (currentTime - parseInt(lastEmailTime)) < rateLimitMs) {
            return {
                success: false,
                message: 'Please wait before sending another message.',
                errors: ['Rate limit exceeded']
            };
        }

        // Send email based on method
        let result;
        if (method === 'emailjs') {
            result = await this.sendEmailWithEmailJS(data);
        } else {
            result = await this.sendEmailWithServerless(data);
        }

        // Update rate limiting on success
        if (result.success) {
            localStorage.setItem('lastEmailTime', currentTime.toString());
        }

        return result;
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EmailHandler;
} else {
    window.EmailHandler = EmailHandler;
}