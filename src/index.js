const nodemailer = require('nodemailer');
const crypto = require('crypto');

/**
 * OTP Email Sender - A simple and secure OTP generator and email sender
 */
class OTPEmailSender {
  /**
   * Initialize the OTP Email Sender
   * @param {Object} config - Configuration object
   * @param {string} config.service - Email service (e.g., 'gmail', 'outlook')
   * @param {string} config.user - Email username
   * @param {string} config.pass - Email password or app password
   * @param {string} [config.from] - From email address (defaults to user)
   * @param {number} [config.otpLength] - OTP length (default: 6)
   * @param {number} [config.expiryMinutes] - OTP expiry in minutes (default: 10)
   */
  constructor(config) {
    if (!config || !config.service || !config.user || !config.pass) {
      throw new Error('Email configuration is required: service, user, and pass');
    }

    this.config = {
      service: config.service,
      user: config.user,
      pass: config.pass,
      from: config.from || config.user,
      otpLength: config.otpLength || 6,
      expiryMinutes: config.expiryMinutes || 10
    };

    // Create transporter
    this.transporter = nodemailer.createTransport({
      service: this.config.service,
      auth: {
        user: this.config.user,
        pass: this.config.pass
      }
    });

    // Store for OTP verification (in production, use Redis or database)
    this.otpStore = new Map();
  }

  /**
   * Generate a secure random OTP
   * @param {number} [length] - OTP length (default: configured length)
   * @returns {string} Generated OTP
   */
  generateOTP(length = this.config.otpLength) {
    if (length < 4 || length > 8) {
      throw new Error('OTP length must be between 4 and 8');
    }

    // Generate cryptographically secure random number
    const max = Math.pow(10, length) - 1;
    const min = Math.pow(10, length - 1);
    
    let otp;
    do {
      const randomBytes = crypto.randomBytes(4);
      const randomNumber = randomBytes.readUInt32BE(0);
      otp = (randomNumber % (max - min + 1)) + min;
    } while (otp.toString().length !== length);

    return otp.toString();
  }

  /**
   * Send OTP via email
   * @param {Object} options - Email options
   * @param {string} options.to - Recipient email address
   * @param {string} [options.subject] - Email subject
   * @param {string} [options.template] - Email template ('default', 'minimal', 'styled')
   * @param {Object} [options.customData] - Custom data for email template
   * @returns {Promise<Object>} Result object with OTP and email info
   */
  async sendOTP(options) {
    if (!options || !options.to) {
      throw new Error('Recipient email address is required');
    }

    const otp = this.generateOTP();
    const expiryTime = new Date(Date.now() + this.config.expiryMinutes * 60 * 1000);

    // Store OTP for verification
    this.otpStore.set(options.to, {
      otp,
      expiryTime,
      verified: false
    });

    const subject = options.subject || 'Your OTP Code';
    const htmlContent = this._generateEmailHTML(otp, options.template, options.customData);
    const textContent = this._generateEmailText(otp);

    try {
      const mailOptions = {
        from: this.config.from,
        to: options.to,
        subject,
        text: textContent,
        html: htmlContent
      };

      const info = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        otp, // Remove in production for security
        messageId: info.messageId,
        to: options.to,
        expiresAt: expiryTime.toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Verify OTP
   * @param {string} email - Email address
   * @param {string} otp - OTP to verify
   * @returns {Object} Verification result
   */
  verifyOTP(email, otp) {
    const storedData = this.otpStore.get(email);

    if (!storedData) {
      return {
        success: false,
        error: 'OTP not found or expired'
      };
    }

    if (storedData.verified) {
      return {
        success: false,
        error: 'OTP already used'
      };
    }

    if (new Date() > storedData.expiryTime) {
      this.otpStore.delete(email);
      return {
        success: false,
        error: 'OTP expired'
      };
    }

    if (storedData.otp !== otp) {
      return {
        success: false,
        error: 'Invalid OTP'
      };
    }

    // Mark as verified
    storedData.verified = true;
    this.otpStore.set(email, storedData);

    return {
      success: true,
      message: 'OTP verified successfully'
    };
  }

  /**
   * Clean up expired OTPs
   */
  cleanupExpired() {
    const now = new Date();
    for (const [email, data] of this.otpStore.entries()) {
      if (now > data.expiryTime) {
        this.otpStore.delete(email);
      }
    }
  }

  /**
   * Generate HTML email content
   * @private
   */
  _generateEmailHTML(otp, template = 'default', customData = {}) {
    const templates = {
      minimal: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your OTP Code</h2>
          <p style="font-size: 24px; font-weight: bold; color: #2196F3; letter-spacing: 3px;">${otp}</p>
          <p>This code expires in ${this.config.expiryMinutes} minutes.</p>
        </div>
      `,
      styled: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 20px; border-radius: 10px;">
          <div style="background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <h1 style="color: #333; text-align: center; margin-bottom: 30px;">${customData.title || 'Verification Code'}</h1>
            <div style="text-align: center; margin: 30px 0;">
              <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; display: inline-block; padding: 15px 30px; border-radius: 8px; font-size: 28px; font-weight: bold; letter-spacing: 5px;">${otp}</div>
            </div>
            <p style="color: #666; text-align: center; margin: 20px 0;">Enter this code to complete your verification</p>
            <p style="color: #999; font-size: 14px; text-align: center;">This code expires in ${this.config.expiryMinutes} minutes</p>
            ${customData.footer ? `<hr style="border: 1px solid #eee; margin: 20px 0;"><p style="color: #999; font-size: 12px; text-align: center;">${customData.footer}</p>` : ''}
          </div>
        </div>
      `,
      default: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #333;">${customData.title || 'Your Verification Code'}</h2>
          <p>Hi there!</p>
          <p>Your verification code is:</p>
          <div style="background: #f0f0f0; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
            <span style="font-size: 32px; font-weight: bold; color: #2196F3; letter-spacing: 5px;">${otp}</span>
          </div>
          <p><strong>Important:</strong> This code will expire in ${this.config.expiryMinutes} minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          ${customData.companyName ? `<p>Best regards,<br>${customData.companyName}</p>` : ''}
        </div>
      `
    };

    return templates[template] || templates.default;
  }

  /**
   * Generate plain text email content
   * @private
   */
  _generateEmailText(otp) {
    return `Your verification code is: ${otp}\n\nThis code will expire in ${this.config.expiryMinutes} minutes.\n\nIf you didn't request this code, please ignore this email.`;
  }
}

module.exports = OTPEmailSender;
