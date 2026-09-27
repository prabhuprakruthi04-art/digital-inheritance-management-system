import nodemailer from "nodemailer";

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587", 10),
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an email notification with automatic preview fallback if SMTP credentials aren't configured
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject line
 * @param {string} options.text - Plain text body
 * @param {string} [options.html] - HTML body (optional)
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // If SMTP credentials are dummy or missing, log a clean preview to console
    const isMock =
      !process.env.SMTP_USER ||
      !process.env.SMTP_PASS ||
      process.env.SMTP_PASS === "your_16_digit_app_password" ||
      process.env.SMTP_USER.includes("example.com");

    if (isMock) {
      console.log("\n=======================================================");
      console.log("📧 [NODEMAILER SIMULATION / PREVIEW]");
      console.log(`To      : ${to}`);
      console.log(`Subject : ${subject}`);
      console.log(`Text    : ${text}`);
      console.log("=======================================================\n");
      return { success: true, simulated: true };
    }

    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || "Digital Inheritance System"}" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
      html: html || `<p>${text}</p>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`📧 Email sent successfully to ${to}. Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send email to ${to}:`, error.message);
    // Graceful return so failing email does not crash cron jobs or request pipelines
    return { success: false, error: error.message };
  }
};

/**
 * Dispatches an automated inheritance activation notification to a designated nominee
 */
export const sendNomineeInheritanceTriggerEmail = async ({
  nomineeEmail,
  nomineeName = "Trusted Nominee",
  ownerName = "Vault Owner",
  transferAuthId,
  claimsPortalUrl = "http://localhost:5173/nominee/claims",
  otp = "",
  demoOtp = "",
}) => {
  const securityOtp = otp || demoOtp || Math.floor(100000 + Math.random() * 900000).toString();
  const subject = `[DIMS Notification] Digital Inheritance Transfer Activated: ${transferAuthId}`;
  
  const text = `Hello ${nomineeName},\n\n` +
    `An automated inactivity trigger has transitioned the digital estate of ${ownerName} to unlocked status.\n` +
    `Your unique Transfer Authorization ID is: ${transferAuthId}\n` +
    `Confidential Verification OTP: ${securityOtp}\n\n` +
    `Access the Claims Portal to verify your identity and reconstruct your assigned assets:\n${claimsPortalUrl}\n\n` +
    `Best regards,\nDigital Inheritance Management System (DIMS)`;

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #020617; color: #f8fafc; border-radius: 16px; padding: 32px; border: 1px solid #1e293b;">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="background-color: rgba(16, 185, 129, 0.15); color: #34d399; padding: 6px 14px; border-radius: 9999px; font-size: 12px; font-weight: bold; border: 1px solid rgba(16, 185, 129, 0.3);">DECENTRALIZED ESTATE TRANSFER</span>
        <h1 style="color: #ffffff; margin-top: 16px; font-size: 24px;">Digital Inheritance Transfer Activated</h1>
      </div>
      
      <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">Hello <strong>${nomineeName}</strong>,</p>
      
      <p style="color: #94a3b8; font-size: 14px; line-height: 1.6;">
        Due to confirmed inactivity across proof-of-life verification checks, the digital vault of <strong>${ownerName}</strong> has transitioned to inheritance release. Shamir's Secret Sharing Shard 2 has been unlocked in the database for your profile.
      </p>
      
      <div style="background-color: #0f172a; border: 1px solid #334155; border-radius: 12px; padding: 20px; margin: 24px 0; text-align: center;">
        <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; font-weight: 700;">Transfer Authorization ID</div>
        <div style="font-size: 24px; font-family: monospace; font-weight: 900; color: #10b981; margin: 8px 0;">${transferAuthId}</div>
        <div style="font-size: 12px; color: #94a3b8; margin-top: 10px;">Confidential Verification OTP: <code style="color: #38bdf8; font-weight: 900; font-size: 18px; letter-spacing: 0.15em;">${securityOtp}</code></div>
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="${claimsPortalUrl}" style="background-color: #059669; color: #ffffff; text-decoration: none; padding: 14px 28px; font-weight: 700; border-radius: 10px; font-size: 14px; display: inline-block;">Open Claims Portal &rarr;</a>
      </div>
      
      <hr style="border: 0; border-top: 1px solid #1e293b; margin: 24px 0;" />
      
      <p style="font-size: 11px; color: #64748b; text-align: center;">
        This is an automated cryptographic notification issued by the Digital Inheritance Management System (DIMS). Do not share your authorization token.
      </p>
    </div>
  `;

  return sendEmail({ to: nomineeEmail, subject, text, html });
};

export default {
  sendEmail,
  sendNomineeInheritanceTriggerEmail,
};