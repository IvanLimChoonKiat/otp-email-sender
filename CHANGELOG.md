# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-27

### Added
- Initial release of OTP Email Sender
- Cryptographically secure OTP generation (4-8 digits)
- Multiple email templates (default, minimal, styled)
- Built-in OTP verification and expiry handling
- TypeScript support with full type definitions
- Express.js and Next.js integration examples
- Comprehensive test suite
- Detailed documentation and examples

### Features
- 🔒 Secure OTP generation using crypto.randomBytes()
- 📧 NodeMailer integration for reliable email delivery
- 🎨 Customizable email templates with branding support
- ⚡ Easy integration with popular Node.js frameworks
- 🛡️ Built-in security best practices
- 🧪 Zero dependencies except NodeMailer
- 📱 Configurable OTP length and expiry time

### Security
- Uses cryptographically secure random number generation
- Implements proper OTP expiry and cleanup mechanisms
- Includes security best practices documentation
- Supports app-specific passwords for email providers
