# JavaScript SMTP Email Setup Guide

This guide explains how to set up SMTP email functionality using JavaScript instead of PHP.

## 📁 File Structure

```
portfolio/
├── index.html
├── styles.css
├── script.js
├── send-email.js              # Main email handler class
├── netlify/
│   └── functions/
│       └── send-email.js       # Netlify serverless function
├── api/
│   └── send-email.js           # Vercel serverless function
├── package.json
└── JAVASCRIPT_SMTP_SETUP.md
```

## 🚀 Deployment Options

### Option 1: Netlify Functions (Recommended)

#### Setup Steps:
1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Environment Variables** in Netlify Dashboard:
   - `SMTP_HOST`: `smtp.gmail.com`
   - `SMTP_PORT`: `587`
   - `SMTP_SECURE`: `false`
   - `SMTP_USER`: `devarkondasneha@gmail.com`
   - `SMTP_PASS`: `your_gmail_app_password`
   - `FROM_NAME`: `Portfolio Contact Form`
   - `TO_EMAIL`: `devarkondasneha@gmail.com`

4. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

### Option 2: Vercel Functions

#### Setup Steps:
1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Set Environment Variables** in Vercel Dashboard:
   - Same variables as Netlify

4. **Deploy**:
   ```bash
   vercel --prod
   ```

### Option 3: EmailJS (Client-Side)

#### Setup Steps:
1. **Sign up** at [EmailJS.com](https://www.emailjs.com/)
2. **Create Service** (Gmail, Outlook, etc.)
3. **Create Email Template**
4. **Get Service ID, Template ID, and Public Key**
5. **Update send-email.js** with your EmailJS credentials

## 🔧 Configuration

### Gmail SMTP Setup

#### 1. Enable 2-Factor Authentication
- Go to Google Account → Security → 2-Step Verification
- Enable if not already enabled

#### 2. Generate App Password
- Go to Google Account → Security → App passwords
- Select "Mail" and "Other (custom name)"
- Enter "Portfolio Contact Form"
- Copy the 16-character password

#### 3. Update Configuration
```javascript
const emailHandler = new EmailHandler({
    service: 'gmail',
    smtp: {
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'devarkondasneha@gmail.com',
            pass: 'your_16_character_app_password'
        }
    },
    to: 'devarkondasneha@gmail.com',
    from: 'devarkondasneha@gmail.com'
});
```

## 📧 Email Features

### JavaScript EmailHandler Class

#### Features:
- **Input Validation**: Email format, required fields, spam protection
- **Rate Limiting**: Prevents spam submissions
- **HTML Templates**: Beautiful, responsive email formatting
- **XSS Protection**: Sanitizes all input data
- **Error Handling**: Comprehensive error messages

#### Methods:
```javascript
// Initialize
const emailHandler = new EmailHandler(config);

// Send email
const result = await emailHandler.sendEmail(data, 'serverless');

// Validate email
const isValid = emailHandler.validateEmail('test@example.com');

// Sanitize input
const clean = emailHandler.sanitizeInput('<script>alert("xss")</script>');
```

### Email Template Features

#### Styling:
- **Sunset Theme**: Matches your portfolio design
- **Responsive**: Works on all email clients
- **Professional**: Clean, modern layout
- **Interactive**: Reply button for easy responses

#### Content:
- **Sender Information**: Name and email
- **Message Content**: Formatted message
- **Timestamp**: When message was received
- **Reply-To**: Direct reply functionality

## 🔒 Security Features

### Built-in Protection:
- **Input Sanitization**: Prevents XSS attacks
- **Email Validation**: Ensures valid email format
- **Spam Detection**: Basic keyword filtering
- **Rate Limiting**: Prevents abuse
- **CORS Headers**: Secure cross-origin requests

### Additional Security:
- **Environment Variables**: Sensitive data in environment
- **HTTPS Only**: Secure transmission
- **Input Length Limits**: Prevents large payloads
- **Error Logging**: Track issues without exposing details

## 🧪 Testing

### Local Development:
```bash
# Install dependencies
npm install

# Start Netlify dev server
netlify dev

# Test form submission
# Open http://localhost:8888
```

### Production Testing:
1. **Deploy to staging environment**
2. **Test form submission**
3. **Check email delivery**
4. **Verify error handling**
5. **Test rate limiting**

## 🐛 Troubleshooting

### Common Issues:

#### 1. "Failed to send message"
- Check SMTP credentials
- Verify environment variables
- Check server logs

#### 2. "Method not allowed"
- Ensure form uses POST method
- Check CORS configuration

#### 3. "Invalid email format"
- Verify email validation regex
- Check form field names

#### 4. "Rate limit exceeded"
- Wait 1 minute between submissions
- Clear localStorage if needed

### Debug Steps:
1. **Check browser console** for JavaScript errors
2. **Check server logs** for SMTP errors
3. **Verify environment variables** are set correctly
4. **Test SMTP credentials** with email client
5. **Check firewall** allows SMTP ports

## 📊 Performance

### Optimization:
- **Serverless Functions**: Auto-scaling, pay-per-use
- **Connection Pooling**: Reuse SMTP connections
- **Error Retry**: Automatic retry on failures
- **Caching**: Rate limit data in localStorage

### Monitoring:
- **Function Logs**: Track execution times
- **Email Delivery**: Monitor delivery rates
- **Error Rates**: Track failure patterns
- **Usage Metrics**: Monitor function calls

## 🔄 Migration from PHP

### Benefits of JavaScript:
- **No Server Required**: Runs on serverless platforms
- **Better Performance**: Faster execution
- **Easier Deployment**: Simple git push deployment
- **Cost Effective**: Pay only for usage
- **Scalable**: Auto-scales with demand

### Migration Steps:
1. **Replace PHP files** with JavaScript equivalents
2. **Update form action** to use serverless function
3. **Set environment variables** in hosting platform
4. **Test thoroughly** before going live
5. **Monitor performance** after deployment

---

**Note**: This JavaScript implementation provides the same functionality as the PHP version but with better scalability and easier deployment options.