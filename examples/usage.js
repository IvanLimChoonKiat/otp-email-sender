const OTPEmailSender = require('../src/index');

// Example usage of the OTP Email Sender module

async function basicExample() {
  console.log('🔹 Basic Example');
  
  // Initialize with your email configuration
  const otpSender = new OTPEmailSender({
    service: 'gmail', // or 'outlook', 'yahoo', etc.
    user: 'your-email@gmail.com',
    pass: 'your-app-password', // Use app-specific password for Gmail
    otpLength: 6,
    expiryMinutes: 10
  });

  try {
    // Send OTP
    const result = await otpSender.sendOTP({
      to: 'recipient@example.com',
      subject: 'Your Login Code',
      template: 'styled',
      customData: {
        title: 'Welcome Back!',
        companyName: 'Your Company Name'
      }
    });

    console.log('✅ OTP sent successfully:', result);

    // Verify OTP (simulate user input)
    const verification = otpSender.verifyOTP('recipient@example.com', result.otp);
    console.log('✅ Verification result:', verification);

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function expressExample() {
  console.log('\n🔹 Express.js Integration Example');
  
  const otpSender = new OTPEmailSender({
    service: 'gmail',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  });

  // Simulate Express routes
  const mockRequest = { body: { email: 'user@example.com' } };
  const mockResponse = {
    json: (data) => console.log('Response:', data),
    status: (code) => ({ json: (data) => console.log(`Status ${code}:`, data) })
  };

  // Send OTP route handler
  async function sendOTPHandler(req, res) {
    try {
      const { email } = req.body;
      
      const result = await otpSender.sendOTP({
        to: email,
        template: 'default'
      });

      // Don't send OTP in response for security
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

  // Verify OTP route handler
  function verifyOTPHandler(req, res) {
    try {
      const { email, otp } = req.body;
      
      const result = otpSender.verifyOTP(email, otp);
      
      if (result.success) {
        res.json({ success: true, message: 'OTP verified successfully' });
      } else {
        res.status(400).json({ success: false, error: result.error });
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  // Simulate the handlers
  console.log('Sending OTP...');
  await sendOTPHandler(mockRequest, mockResponse);
}

async function nextjsExample() {
  console.log('\n🔹 Next.js API Route Example');
  
  // This would go in pages/api/auth/send-otp.js or app/api/auth/send-otp/route.js
  const apiExample = `
// pages/api/auth/send-otp.js (Pages Router)
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
      template: 'styled',
      customData: {
        title: 'Your Login Code',
        companyName: 'My App'
      }
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

// app/api/auth/verify-otp/route.js (App Router)
export async function POST(request) {
  try {
    const { email, otp } = await request.json();
    
    const result = otpSender.verifyOTP(email, otp);
    
    if (result.success) {
      return Response.json({ success: true, message: 'OTP verified' });
    } else {
      return Response.json({ success: false, error: result.error }, { status: 400 });
    }
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
`;

  console.log('Next.js API Route Example:');
  console.log(apiExample);
}

// Run examples
async function runExamples() {
  console.log('🚀 OTP Email Sender Examples\n');
  
  // Uncomment to run actual examples (requires valid email config)
  // await basicExample();
  // await expressExample();
  await nextjsExample();
  
  console.log('\n📝 Note: Update email configuration with your actual credentials to test sending emails.');
}

if (require.main === module) {
  runExamples().catch(console.error);
}

module.exports = {
  basicExample,
  expressExample,
  nextjsExample
};
