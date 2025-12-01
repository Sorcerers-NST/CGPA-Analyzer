import nodemailer from 'nodemailer';

/**
 * Email utility for sending password reset codes
 * Uses Nodemailer with SMTP configuration
 */

// Create reusable transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
};

/**
 * Send password reset email with 6-digit code
 * @param {string} email - Recipient email address
 * @param {string} code - 6-digit verification code
 * @param {string} username - User's username
 * @returns {Promise<void>}
 */
export const sendPasswordResetEmail = async (email, code, username) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'CGPA Analyzer <noreply@cgpa-analyzer.com>',
      to: email,
      subject: 'Password Reset Code - CGPA Analyzer',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background-color: #f9fafb;
                border-radius: 8px;
                padding: 30px;
                border: 1px solid #e5e7eb;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .code-box {
                background-color: #111827;
                color: white;
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
                text-align: center;
                padding: 20px;
                border-radius: 8px;
                margin: 30px 0;
              }
              .warning {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 12px;
                color: #6b7280;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="color: #111827; margin: 0;">Password Reset Request</h1>
              </div>
              
              <p>Hi <strong>${username}</strong>,</p>
              
              <p>We received a request to reset your password for your CGPA Analyzer account.</p>
              
              <p>Your password reset code is:</p>
              
              <div class="code-box">${code}</div>
              
              <div class="warning">
                <strong>⏱️ This code will expire in 5 minutes.</strong>
              </div>
              
              <p>Enter this code on the password reset page to create a new password.</p>
              
              <p>If you didn't request a password reset, please ignore this email. Your password will remain unchanged.</p>
              
              <div class="footer">
                <p>This is an automated email. Please do not reply to this message.</p>
                <p>&copy; ${new Date().getFullYear()} CGPA Analyzer. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
        Password Reset Request
        
        Hi ${username},
        
        We received a request to reset your password for your CGPA Analyzer account.
        
        Your password reset code is: ${code}
        
        This code will expire in 5 minutes.
        
        Enter this code on the password reset page to create a new password.
        
        If you didn't request a password reset, please ignore this email.
        
        © ${new Date().getFullYear()} CGPA Analyzer
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password reset email sent:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

/**
 * Send password change verification email with 6-digit code
 * @param {string} email - Recipient email address
 * @param {string} code - 6-digit verification code
 * @param {string} username - User's username
 * @returns {Promise<void>}
 */
export const sendPasswordChangeVerificationEmail = async (email, code, username) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'CGPA Analyzer <noreply@cgpa-analyzer.com>',
      to: email,
      subject: 'Verify Password Change Request - CGPA Analyzer',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
              }
              .container {
                background-color: #f9fafb;
                border-radius: 8px;
                padding: 30px;
                border: 1px solid #e5e7eb;
              }
              .header {
                text-align: center;
                margin-bottom: 30px;
              }
              .code-box {
                background-color: #111827;
                color: white;
                font-size: 32px;
                font-weight: bold;
                letter-spacing: 8px;
                text-align: center;
                padding: 20px;
                border-radius: 8px;
                margin: 30px 0;
              }
              .warning {
                background-color: #fef3c7;
                border-left: 4px solid #f59e0b;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
              }
              .security-notice {
                background-color: #dbeafe;
                border-left: 4px solid #3b82f6;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
              }
              .footer {
                text-align: center;
                margin-top: 30px;
                font-size: 12px;
                color: #6b7280;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="color: #111827; margin: 0;">🔐 Password Change Verification</h1>
              </div>
              
              <p>Hi <strong>${username}</strong>,</p>
              
              <p>We received a request to change your password for your CGPA Analyzer account.</p>
              
              <p>Your verification code is:</p>
              
              <div class="code-box">${code}</div>
              
              <div class="warning">
                <strong>⏱️ This code will expire in 5 minutes.</strong>
              </div>
              
              <p>Enter this code in the Settings page to authorize the password change.</p>
              
              <div class="security-notice">
                <strong>🛡️ Security Notice:</strong> If you didn't request this password change, someone may be trying to access your account. Please secure your account immediately.
              </div>
              
              <div class="footer">
                <p>This is an automated email. Please do not reply to this message.</p>
                <p>&copy; ${new Date().getFullYear()} CGPA Analyzer. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `,
      text: `
        Password Change Verification
        
        Hi ${username},
        
        We received a request to change your password for your CGPA Analyzer account.
        
        Your verification code is: ${code}
        
        This code will expire in 5 minutes.
        
        Enter this code in the Settings page to authorize the password change.
        
        Security Notice: If you didn't request this password change, someone may be trying to access your account. Please secure your account immediately.
        
        © ${new Date().getFullYear()} CGPA Analyzer
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Password change verification email sent:', info.messageId);
    
    return info;
  } catch (error) {
    console.error('Error sending password change verification email:', error);
    throw new Error('Failed to send password change verification email');
  }
};

/**
 * Test email configuration
 * @returns {Promise<boolean>}
 */
export const testEmailConnection = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email server connection verified');
    return true;
  } catch (error) {
    console.error('❌ Email server connection failed:', error.message);
    return false;
  }
};
