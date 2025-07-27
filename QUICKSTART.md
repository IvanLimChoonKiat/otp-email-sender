# ⚡ Quick Start Guide

Get up and running with OTP Email Sender in under 5 minutes!

## 🚀 Installation

```bash
npm install otp-email-sender
```

## 📧 Email Setup

### Gmail Setup (Recommended)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → App passwords
   - Select "Mail" and your device
   - Copy the 16-character password

3. **Use the app password** in your code (not your regular Gmail password)

## 💻 Basic Usage

```javascript
const OTPEmailSender = require('otp-email-sender');

// Initialize
const otpSender = new OTPEmailSender({
  service: 'gmail',
  user: 'your-email@gmail.com',
  pass: 'your-16-char-app-password' // Not your regular password!
});

// Send OTP
async function sendLoginCode(userEmail) {
  try {
    const result = await otpSender.sendOTP({
      to: userEmail,
      subject: 'Your Login Code',
      template: 'styled'
    });
    
    console.log('✅ OTP sent successfully!');
    return result;
  } catch (error) {
    console.error('❌ Failed to send OTP:', error.message);
  }
}

// Verify OTP
function verifyLoginCode(userEmail, userEnteredOTP) {
  const result = otpSender.verifyOTP(userEmail, userEnteredOTP);
  
  if (result.success) {
    console.log('✅ OTP verified! User can log in.');
    return true;
  } else {
    console.log('❌ Invalid OTP:', result.error);
    return false;
  }
}

// Example usage
await sendLoginCode('user@example.com');
const isValid = verifyLoginCode('user@example.com', '123456');
```

## 🎨 Templates

Choose from 3 beautiful email templates:

```javascript
// Professional template with your branding
await otpSender.sendOTP({
  to: 'user@example.com',
  template: 'default',
  customData: {
    title: 'Welcome Back!',
    companyName: 'Your Company'
  }
});

// Clean and minimal
await otpSender.sendOTP({
  to: 'user@example.com',
  template: 'minimal'
});

// Modern with gradients
await otpSender.sendOTP({
  to: 'user@example.com',
  template: 'styled',
  customData: {
    title: 'Verification Required',
    footer: 'This code expires in 10 minutes'
  }
});
```

## 🔧 Environment Variables

Create a `.env` file for security:

```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

Then use in your code:

```javascript
require('dotenv').config();

const otpSender = new OTPEmailSender({
  service: process.env.EMAIL_SERVICE,
  user: process.env.EMAIL_USER,
  pass: process.env.EMAIL_PASS
});
```

## 🚨 Common Issues

### "Invalid login" error
- ✅ Use app-specific password, not regular password
- ✅ Enable 2-factor authentication first
- ✅ Check email service name ('gmail', 'outlook', etc.)

### "Connection refused" error
- ✅ Check internet connection
- ✅ Verify email service is correct
- ✅ Some corporate firewalls block SMTP

### OTP not received
- ✅ Check spam folder
- ✅ Verify recipient email address
- ✅ Try different email template

## 📱 Next Steps

- Check out the [full documentation](README.md)
- See [framework integration examples](examples/usage.js)
- Learn about [publishing your own modules](PUBLISHING.md)

## 🆘 Need Help?

- 📖 Read the full [README.md](README.md)
- 🔍 Check existing [GitHub issues](https://github.com/IvanLimChoonKiat/otp-email-sender/issues)
- 💬 Create a new issue if you're stuck

---

**You're all set!** 🎉 Start building secure authentication flows with OTP Email Sender!
