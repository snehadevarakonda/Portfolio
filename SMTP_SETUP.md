# SMTP Email Setup Guide

This guide will help you set up SMTP email functionality for your portfolio contact form.

## 📧 Setup Instructions

### 1. Gmail SMTP Setup (Recommended)

#### Step 1: Enable 2-Factor Authentication
1. Go to your Google Account settings
2. Navigate to Security → 2-Step Verification
3. Enable 2-Step Verification if not already enabled

#### Step 2: Generate App Password
1. Go to Google Account → Security → App passwords
2. Select "Mail" and "Other (custom name)"
3. Enter "Portfolio Contact Form" as the name
4. Copy the generated 16-character password

#### Step 3: Update Configuration
1. Open `config.php`
2. Replace `your_app_password_here` with your generated app password
3. Save the file

### 2. Server Requirements

#### PHP Requirements
- PHP 7.0 or higher
- `mail()` function enabled
- `openssl` extension (for TLS encryption)

#### Web Server
- Apache or Nginx
- Ability to execute PHP scripts
- SMTP port 587 or 465 accessible

### 3. File Structure
```
portfolio/
├── index.html
├── styles.css
├── script.js
├── send_email_smtp.php
├── config.php
└── SMTP_SETUP.md
```

### 4. Testing the Setup

#### Test Form Submission
1. Open your portfolio website
2. Fill out the contact form
3. Submit the form
4. Check your email inbox for the message

#### Debug Common Issues
- **"Failed to send message"**: Check SMTP credentials and server settings
- **"Method not allowed"**: Ensure form is using POST method
- **"Validation errors"**: Check form field requirements

### 5. Alternative SMTP Providers

#### Outlook/Hotmail
```php
'host' => 'smtp-mail.outlook.com',
'port' => 587,
'encryption' => 'tls'
```

#### Yahoo Mail
```php
'host' => 'smtp.mail.yahoo.com',
'port' => 587,
'encryption' => 'tls'
```

#### Custom SMTP Server
```php
'host' => 'your-smtp-server.com',
'port' => 587, // or 465 for SSL
'encryption' => 'tls' // or 'ssl'
```

### 6. Security Features

#### Built-in Protection
- **Rate Limiting**: Prevents spam (1 email per minute)
- **Input Validation**: Sanitizes all form data
- **Spam Detection**: Basic keyword filtering
- **XSS Protection**: Escapes HTML content

#### Additional Security (Optional)
- Add CAPTCHA verification
- Implement honeypot fields
- Use CSRF tokens
- Set up email logging

### 7. Troubleshooting

#### Common Issues
1. **Gmail App Password**: Make sure you're using App Password, not regular password
2. **Server Configuration**: Ensure PHP mail() function is enabled
3. **Firewall**: Check if SMTP ports are blocked
4. **SSL/TLS**: Verify encryption settings match your provider

#### Error Messages
- `"Failed to send message"`: SMTP configuration issue
- `"Method not allowed"`: Form submission method error
- `"Validation errors"`: Form data validation failed

### 8. Production Deployment

#### Before Going Live
1. Test thoroughly on staging server
2. Set up proper error logging
3. Configure backup email delivery
4. Monitor email delivery rates

#### Performance Optimization
- Implement email queuing for high volume
- Use CDN for static assets
- Enable gzip compression
- Set up caching headers

## 🔧 Advanced Configuration

### Custom Email Templates
Edit the email template in `send_email_smtp.php` to customize:
- Email styling
- Content layout
- Footer information
- Branding elements

### Multiple Recipients
To send emails to multiple addresses:
```php
$recipients = [
    'devarkondasneha@gmail.com',
    'backup@example.com'
];
```

### Email Logging
Add logging functionality:
```php
error_log("Contact form submission: " . $email . " - " . date('Y-m-d H:i:s'));
```

## 📞 Support

If you encounter issues:
1. Check server error logs
2. Verify SMTP credentials
3. Test with different email providers
4. Contact your hosting provider for SMTP support

---

**Note**: This setup uses PHP's built-in `mail()` function. For production use with high volume, consider using PHPMailer or similar libraries for better reliability and features.