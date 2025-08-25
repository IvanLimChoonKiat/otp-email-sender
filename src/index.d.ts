export interface OTPConfig {
  service?: string;
  host?: string;
  port?: number;
  secure?: boolean;
  user: string;
  pass: string;
  from?: string;
  otpLength?: number;
  expiryMinutes?: number;
}

export interface SendOTPOptions {
  to: string;
  subject?: string;
  template?: 'default' | 'minimal' | 'styled';
  customData?: {
    title?: string;
    companyName?: string;
    footer?: string;
    [key: string]: any;
  };
}

export interface OTPResult {
  success: boolean;
  otp: string;
  messageId: string;
  to: string;
  expiresAt: string;
}

export interface VerificationResult {
  success: boolean;
  error?: string;
  message?: string;
}

export declare class OTPEmailSender {
  constructor(config: OTPConfig);
  
  generateOTP(length?: number): string;
  
  sendOTP(options: SendOTPOptions): Promise<OTPResult>;
  
  verifyOTP(email: string, otp: string): VerificationResult;
  
  cleanupExpired(): void;
}

export = OTPEmailSender;
