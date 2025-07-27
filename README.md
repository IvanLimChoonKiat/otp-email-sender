# 🔐 OTP Email Sender

A secure and easy-to-use **6-digit OTP generator and email sender** using NodeMailer. Perfect for authentication flows in Node.js and Next.js applications.

[![npm version](https://badge.fury.io/js/otp-email-sender.svg)](https://badge.fury.io/js/otp-email-sender)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D14.0.0-brightgreen)](https://nodejs.org/)

## ✨ Features

- 🔒 **Cryptographically secure** OTP generation
- 📧 **Multiple email templates** (default, minimal, styled)
- ⚡ **Easy integration** with Express.js, Next.js, and other frameworks
- 🛡️ **Built-in verification** and expiry handling
- 📱 **Customizable OTP length** (4-8 digits)
- 🎨 **Template customization** with your branding
- 🧪 **TypeScript support** with full type definitions
- 🚀 **Zero dependencies** except NodeMailer

## 📦 Installation

```bash
npm install otp-email-sender
```

## 🚀 Quick Start

```javascript
const OTPEmailSender = require('otp-email-sender');

// Initialize with your email configuration
const otpSender = new OTPEmailSender({
  service: 'gmail',
  user: 'your-email@gmail.com',
  pass: 'your-app-password', // Use app-specific password
  otpLength: 6,
  expiryMinutes: 10
});

// Send OTP
const result = await otpSender.sendOTP({
  to: 'user@example.com',
  subject: 'Your Login Code',
  template: 'styled'
});

// Verify OTP
const verification = otpSender.verifyOTP('user@example.com', '123456');
console.log(verification.success); // true or false
```

## 📖 API Reference

### Constructor

```javascript
new OTPEmailSender(config)
```

**config** object properties:
- `service` (string): Email service ('gmail', 'outlook', 'yahoo', etc.)
- `user` (string): Your email address
- `pass` (string): Your email password or app-specific password
- `from` (string, optional): From email address (defaults to `user`)
- `otpLength` (number, optional): OTP length, 4-8 digits (default: 6)
- `expiryMinutes` (number, optional): OTP expiry time in minutes (default: 10)

### Methods

#### `sendOTP(options)`

Sends an OTP via email.

**Parameters:**
- `to` (string): Recipient email address
- `subject` (string, optional): Email subject
- `template` (string, optional): Email template ('default', 'minimal', 'styled')
- `customData` (object, optional): Custom data for email templates

**Returns:** Promise resolving to:
```javascript
{
  success: true,
  otp: "123456",
  messageId: "...",
  to: "user@example.com",
  expiresAt: "2025-01-27T..."
}
```

#### `verifyOTP(email, otp)`

Verifies an OTP for a given email.

**Returns:**
```javascript
{
  success: true,
  message: "OTP verified successfully"
}
// or
{
  success: false,
  error: "Invalid OTP"
}
```

#### `generateOTP(length?)`

Generates a secure random OTP.

**Returns:** String OTP

#### `cleanupExpired()`

Removes expired OTPs from memory. Call periodically to prevent memory leaks.

## 🎨 Email Templates

### Default Template
Professional template with clear formatting and your custom branding.

### Minimal Template
Clean and simple design for basic use cases.

### Styled Template
Modern gradient design with enhanced visual appeal.

### Custom Data
Personalize templates with:
```javascript
{
  title: 'Welcome Back!',
  companyName: 'Your Company',
  footer: 'If you didn\'t request this, please ignore.'
}
```

## 🔧 Framework Integration

### Express.js

```javascript
const express = require('express');
const OTPEmailSender = require('otp-email-sender');

const app = express();
const otpSender = new OTPEmailSender({
  service: 'gmail',
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS
});

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    
    const result = await otpSender.sendOTP({
      to: email,
      template: 'styled'
    });

    res.json({
      success: true,
      message: 'OTP sent successfully',
      expiresAt: result.expiresAt
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Verify OTP endpoint
app.post('/api/verify-otp', (req, res) => {
  try {
    const { email, otp } = req.body;
    const result = otpSender.verifyOTP(email, otp);
    
    if (result.success) {
      res.json({ success: true, message: 'OTP verified' });
    } else {
      res.status(400).json({ success: false, error: result.error });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Next.js (App Router)

```javascript
// app/api/auth/send-otp/route.js
import OTPEmailSender from 'otp-email-sender';

const otpSender = new OTPEmailSender({
  service: 'gmail',
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
});

export async function POST(request) {
  try {
    const { email } = await request.json();
    
    const result = await otpSender.sendOTP({
      to: email,
      template: 'styled',
      customData: {
        title: 'Your Login Code',
        companyName: 'My App'
      }
    });

    return Response.json({
      success: true,
      message: 'OTP sent successfully',
      expiresAt: result.expiresAt
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
```

### Next.js (Pages Router)

```javascript
// pages/api/auth/send-otp.js
import OTPEmailSender from 'otp-email-sender';

const otpSender = new OTPEmailSender({
  service: 'gmail',
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    
    const result = await otpSender.sendOTP({
      to: email,
      template: 'default'
    });

    res.json({
      success: true,
      message: 'OTP sent successfully',
      expiresAt: result.expiresAt
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
}
```

## 🔒 Security Best Practices

1. **Environment Variables**: Store email credentials in environment variables
2. **App Passwords**: Use app-specific passwords instead of regular passwords
3. **HTTPS Only**: Always use HTTPS in production
4. **Rate Limiting**: Implement rate limiting for OTP requests
5. **Don't Log OTPs**: Never log OTP values in production
6. **Memory Management**: Call `cleanupExpired()` periodically

## 📧 Email Service Setup

### Gmail
1. Enable 2-factor authentication
2. Generate an app-specific password
3. Use the app password in your configuration

### Outlook/Hotmail
1. Enable 2-factor authentication
2. Create an app password
3. Use 'outlook' as the service

### Other Providers
Most major email providers are supported. See [NodeMailer documentation](https://nodemailer.com/smtp/well-known/) for the full list.

## 🧪 Testing

Run the included tests:

```bash
npm test
```

Run examples:

```bash
npm run example
```

## 🛠️ Environment Variables

Create a `.env` file:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

## ⚠️ Production Considerations

- Use a database or Redis instead of in-memory storage for OTPs
- Implement rate limiting to prevent abuse
- Set up proper error monitoring
- Use secure session management
- Implement proper user authentication

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [npm package](https://npmjs.com/package/otp-email-sender)
- [GitHub repository](https://github.com/yourusername/otp-email-sender)
- [NodeMailer documentation](https://nodemailer.com/)

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the examples in the `/examples` folder
- Read the documentation above

---

Made with ❤️ for the Node.js community
