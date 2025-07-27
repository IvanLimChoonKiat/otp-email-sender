const OTPEmailSender = require('../src/index');

// Simple test framework
class SimpleTest {
  constructor() {
    this.tests = [];
    this.passed = 0;
    this.failed = 0;
  }

  test(name, testFn) {
    this.tests.push({ name, testFn });
  }

  async run() {
    console.log('🧪 Running Tests\n');
    
    for (const { name, testFn } of this.tests) {
      try {
        await testFn();
        console.log(`✅ ${name}`);
        this.passed++;
      } catch (error) {
        console.log(`❌ ${name}: ${error.message}`);
        this.failed++;
      }
    }

    console.log(`\n📊 Test Results: ${this.passed} passed, ${this.failed} failed`);
  }

  assert(condition, message) {
    if (!condition) {
      throw new Error(message || 'Assertion failed');
    }
  }

  assertEqual(actual, expected, message) {
    if (actual !== expected) {
      throw new Error(message || `Expected ${expected}, got ${actual}`);
    }
  }
}

// Mock email configuration for testing
const mockConfig = {
  service: 'gmail',
  user: 'test@example.com',
  pass: 'test-password'
};

const test = new SimpleTest();

// Test OTP generation
test.test('should generate OTP with default length (6)', () => {
  const otpSender = new OTPEmailSender(mockConfig);
  const otp = otpSender.generateOTP();
  
  test.assert(typeof otp === 'string', 'OTP should be a string');
  test.assertEqual(otp.length, 6, 'Default OTP length should be 6');
  test.assert(/^\d{6}$/.test(otp), 'OTP should contain only digits');
});

test.test('should generate OTP with custom length', () => {
  const otpSender = new OTPEmailSender(mockConfig);
  const otp4 = otpSender.generateOTP(4);
  const otp8 = otpSender.generateOTP(8);
  
  test.assertEqual(otp4.length, 4, 'Custom OTP length should be 4');
  test.assertEqual(otp8.length, 8, 'Custom OTP length should be 8');
});

test.test('should throw error for invalid OTP length', () => {
  const otpSender = new OTPEmailSender(mockConfig);
  
  try {
    otpSender.generateOTP(3); // Too short
    test.assert(false, 'Should throw error for length < 4');
  } catch (error) {
    test.assert(error.message.includes('OTP length must be between 4 and 8'));
  }
  
  try {
    otpSender.generateOTP(9); // Too long
    test.assert(false, 'Should throw error for length > 8');
  } catch (error) {
    test.assert(error.message.includes('OTP length must be between 4 and 8'));
  }
});

test.test('should initialize with correct configuration', () => {
  const config = {
    service: 'outlook',
    user: 'test@outlook.com',
    pass: 'password123',
    otpLength: 8,
    expiryMinutes: 15
  };
  
  const otpSender = new OTPEmailSender(config);
  
  test.assertEqual(otpSender.config.service, 'outlook');
  test.assertEqual(otpSender.config.user, 'test@outlook.com');
  test.assertEqual(otpSender.config.otpLength, 8);
  test.assertEqual(otpSender.config.expiryMinutes, 15);
});

test.test('should throw error for missing configuration', () => {
  try {
    new OTPEmailSender({});
    test.assert(false, 'Should throw error for missing config');
  } catch (error) {
    test.assert(error.message.includes('Email configuration is required'));
  }
});

test.test('should verify OTP correctly', () => {
  const otpSender = new OTPEmailSender(mockConfig);
  const email = 'test@example.com';
  const otp = '123456';
  
  // Manually set OTP in store for testing
  otpSender.otpStore.set(email, {
    otp,
    expiryTime: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes from now
    verified: false
  });
  
  // Test correct OTP
  const result = otpSender.verifyOTP(email, otp);
  test.assert(result.success, 'Should verify correct OTP');
  
  // Test already used OTP
  const result2 = otpSender.verifyOTP(email, otp);
  test.assert(!result2.success, 'Should reject already used OTP');
  test.assert(result2.error.includes('already used'));
});

test.test('should reject invalid OTP', () => {
  const otpSender = new OTPEmailSender(mockConfig);
  const email = 'test@example.com';
  
  // Set OTP in store
  otpSender.otpStore.set(email, {
    otp: '123456',
    expiryTime: new Date(Date.now() + 10 * 60 * 1000),
    verified: false
  });
  
  // Test wrong OTP
  const result = otpSender.verifyOTP(email, '654321');
  test.assert(!result.success, 'Should reject invalid OTP');
  test.assert(result.error.includes('Invalid OTP'));
});

test.test('should reject expired OTP', () => {
  const otpSender = new OTPEmailSender(mockConfig);
  const email = 'test@example.com';
  
  // Set expired OTP
  otpSender.otpStore.set(email, {
    otp: '123456',
    expiryTime: new Date(Date.now() - 1000), // Expired 1 second ago
    verified: false
  });
  
  const result = otpSender.verifyOTP(email, '123456');
  test.assert(!result.success, 'Should reject expired OTP');
  test.assert(result.error.includes('expired'));
});

test.test('should clean up expired OTPs', () => {
  const otpSender = new OTPEmailSender(mockConfig);
  
  // Add expired and valid OTPs
  otpSender.otpStore.set('expired@example.com', {
    otp: '111111',
    expiryTime: new Date(Date.now() - 1000),
    verified: false
  });
  
  otpSender.otpStore.set('valid@example.com', {
    otp: '222222',
    expiryTime: new Date(Date.now() + 60000),
    verified: false
  });
  
  test.assertEqual(otpSender.otpStore.size, 2, 'Should have 2 OTPs before cleanup');
  
  otpSender.cleanupExpired();
  
  test.assertEqual(otpSender.otpStore.size, 1, 'Should have 1 OTP after cleanup');
  test.assert(otpSender.otpStore.has('valid@example.com'), 'Valid OTP should remain');
  test.assert(!otpSender.otpStore.has('expired@example.com'), 'Expired OTP should be removed');
});

test.test('should generate different HTML templates', () => {
  const otpSender = new OTPEmailSender(mockConfig);
  const otp = '123456';
  
  const defaultHTML = otpSender._generateEmailHTML(otp, 'default');
  const minimalHTML = otpSender._generateEmailHTML(otp, 'minimal');
  const styledHTML = otpSender._generateEmailHTML(otp, 'styled');
  
  test.assert(defaultHTML.includes(otp), 'Default template should contain OTP');
  test.assert(minimalHTML.includes(otp), 'Minimal template should contain OTP');
  test.assert(styledHTML.includes(otp), 'Styled template should contain OTP');
  
  test.assert(defaultHTML !== minimalHTML, 'Templates should be different');
  test.assert(minimalHTML !== styledHTML, 'Templates should be different');
});

test.test('should generate plain text email', () => {
  const otpSender = new OTPEmailSender(mockConfig);
  const otp = '123456';
  
  const text = otpSender._generateEmailText(otp);
  
  test.assert(text.includes(otp), 'Text should contain OTP');
  test.assert(text.includes('verification code'), 'Text should mention verification code');
});

// Run the tests
if (require.main === module) {
  test.run().catch(console.error);
}

module.exports = test;
