/**
 * Email delivery via SMTP (Nodemailer).
 * Falls back to console logging when credentials are not configured (dev/test).
 */

import nodemailer from 'nodemailer';

function isConfigured(): boolean {
  return !!(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD
  );
}

function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
}

const FROM = process.env.EMAIL_FROM || 'VivaahAI <noreply@vivaahai.techotd.in>';

export async function sendPasswordResetEmail(email: string, otp: string): Promise<void> {
  if (!isConfigured()) {
    console.log(`\n========================================`);
    console.log(`  [Email not configured — dev fallback]`);
    console.log(`  Password Reset OTP for ${email}: ${otp}`);
    console.log(`  Set SMTP_* env vars to enable real email`);
    console.log(`========================================\n`);
    return;
  }

  await createTransporter().sendMail({
    from: FROM,
    to: email,
    subject: `${otp} — Your VivaahAI Password Reset Code`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#f9f0f3;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f0f3;padding:40px 0;">
          <tr><td align="center">
            <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(107,27,61,0.08);">
              <!-- Header -->
              <tr>
                <td style="background:#6B1B3D;padding:28px 32px;text-align:center;">
                  <span style="color:#D4AF37;font-size:22px;font-weight:800;letter-spacing:1px;">❤ VivaahAI</span>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:36px 32px;">
                  <h2 style="margin:0 0 8px;color:#1a1a1a;font-size:20px;">Password Reset Request</h2>
                  <p style="margin:0 0 24px;color:#666;font-size:14px;line-height:1.6;">
                    We received a request to reset your VivaahAI password. Use the code below to continue.
                  </p>

                  <!-- OTP Box -->
                  <div style="background:#f9f0f3;border:2px dashed #D4AF37;border-radius:12px;padding:24px;text-align:center;margin-bottom:24px;">
                    <p style="margin:0 0 8px;color:#6B1B3D;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:2px;">Your OTP Code</p>
                    <p style="margin:0;color:#6B1B3D;font-size:40px;font-weight:800;letter-spacing:12px;">${otp}</p>
                    <p style="margin:8px 0 0;color:#999;font-size:12px;">Valid for 10 minutes</p>
                  </div>

                  <p style="margin:0 0 8px;color:#999;font-size:13px;">
                    If you did not request this, please ignore this email. Your password will not change.
                  </p>
                  <p style="margin:0;color:#e53e3e;font-size:13px;font-weight:600;">
                    Never share this code with anyone.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="background:#fdf6f9;padding:16px 32px;text-align:center;border-top:1px solid #f0e0e8;">
                  <p style="margin:0;color:#aaa;font-size:12px;">© ${new Date().getFullYear()} VivaahAI — India's AI-powered matrimonial platform</p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
    text: `Your VivaahAI password reset code is: ${otp}\n\nValid for 10 minutes. Do not share this with anyone.\n\nIf you didn't request this, ignore this email.`,
  });
}

export async function sendPaymentReceiptEmail(
  email: string,
  fullName: string,
  tier: string,
  amount: number,
  paymentId: string,
  expiresAt: string,
): Promise<void> {
  const tierLabel = tier.charAt(0).toUpperCase() + tier.slice(1);
  const amountStr = `₹${(amount / 100).toLocaleString('en-IN')}`;
  const expiry    = new Date(expiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });

  if (!isConfigured()) {
    console.log(`\n[Email] Payment receipt for ${email}: ${tierLabel} plan, ${amountStr}`);
    return;
  }

  await createTransporter().sendMail({
    from: FROM,
    to: email,
    subject: `Payment Confirmed — ${tierLabel} Plan Active ✓`,
    html: `
      <!DOCTYPE html><html>
      <body style="margin:0;padding:0;background:#f9f0f3;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f0f3;padding:40px 0;">
          <tr><td align="center">
            <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(107,27,61,0.08);">
              <tr><td style="background:#6B1B3D;padding:28px 32px;text-align:center;">
                <span style="color:#D4AF37;font-size:22px;font-weight:800;letter-spacing:1px;">❤ VivaahAI</span>
              </td></tr>
              <tr><td style="padding:36px 32px;">
                <h2 style="margin:0 0 8px;color:#1a1a1a;font-size:20px;">Payment Successful! 🎉</h2>
                <p style="margin:0 0 24px;color:#666;font-size:14px;">Hi ${fullName}, your ${tierLabel} plan is now active.</p>
                <table width="100%" cellpadding="0" cellspacing="0" style="background:#fdf6f9;border-radius:12px;padding:20px;margin-bottom:24px;">
                  <tr><td style="padding:6px 0;color:#888;font-size:13px;">Plan</td><td style="padding:6px 0;color:#1a1a1a;font-size:13px;font-weight:700;text-align:right;">${tierLabel}</td></tr>
                  <tr><td style="padding:6px 0;color:#888;font-size:13px;">Amount Paid</td><td style="padding:6px 0;color:#6B1B3D;font-size:16px;font-weight:800;text-align:right;">${amountStr}</td></tr>
                  <tr><td style="padding:6px 0;color:#888;font-size:13px;">Payment ID</td><td style="padding:6px 0;color:#1a1a1a;font-size:12px;text-align:right;">${paymentId}</td></tr>
                  <tr><td style="padding:6px 0;color:#888;font-size:13px;">Valid Until</td><td style="padding:6px 0;color:#1a1a1a;font-size:13px;font-weight:600;text-align:right;">${expiry}</td></tr>
                </table>
                <p style="margin:0;color:#666;font-size:13px;line-height:1.6;">Login to VivaahAI and start exploring your premium features. For any issues, reply to this email.</p>
              </td></tr>
              <tr><td style="background:#fdf6f9;padding:16px 32px;text-align:center;border-top:1px solid #f0e0e8;">
                <p style="margin:0;color:#aaa;font-size:12px;">© ${new Date().getFullYear()} VivaahAI — India's AI-powered matrimonial platform</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body></html>
    `,
    text: `Payment confirmed! Your ${tierLabel} plan is active. Amount: ${amountStr}. Payment ID: ${paymentId}. Valid until: ${expiry}.`,
  });
}

export async function sendMatchNotificationEmail(
  email: string,
  recipientName: string,
  likerName: string,
  isMutual: boolean,
): Promise<void> {
  if (!isConfigured()) {
    console.log(`[Email] Match notification for ${email}: ${likerName} liked you (mutual: ${isMutual})`);
    return;
  }

  const subject = isMutual
    ? `🎉 It's a Match! You and ${likerName} liked each other`
    : `💕 ${likerName} is interested in you on VivaahAI`;

  await createTransporter().sendMail({
    from: FROM,
    to: email,
    subject,
    html: `
      <!DOCTYPE html><html>
      <body style="margin:0;padding:0;background:#f9f0f3;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f0f3;padding:40px 0;">
          <tr><td align="center">
            <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(107,27,61,0.08);">
              <tr><td style="background:#6B1B3D;padding:28px 32px;text-align:center;">
                <span style="color:#D4AF37;font-size:22px;font-weight:800;letter-spacing:1px;">❤ VivaahAI</span>
              </td></tr>
              <tr><td style="padding:36px 32px;text-align:center;">
                <div style="font-size:48px;margin-bottom:16px;">${isMutual ? '🎉' : '💕'}</div>
                <h2 style="margin:0 0 12px;color:#1a1a1a;font-size:22px;">${isMutual ? "It's a Match!" : 'Someone liked you!'}</h2>
                <p style="margin:0 0 24px;color:#666;font-size:15px;line-height:1.6;">
                  Hi ${recipientName}, <strong style="color:#6B1B3D;">${likerName}</strong> ${isMutual ? 'and you liked each other! Start chatting now.' : 'has shown interest in your profile.'}
                </p>
                <a href="https://vivaahai.techotd.in/matches" style="display:inline-block;background:#6B1B3D;color:#fff;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;text-decoration:none;">
                  ${isMutual ? 'Start Chatting' : 'View Profile'}
                </a>
              </td></tr>
              <tr><td style="background:#fdf6f9;padding:16px 32px;text-align:center;border-top:1px solid #f0e0e8;">
                <p style="margin:0;color:#aaa;font-size:12px;">© ${new Date().getFullYear()} VivaahAI — India's AI-powered matrimonial platform</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body></html>
    `,
    text: isMutual
      ? `It's a match! You and ${likerName} liked each other on VivaahAI. Open the app to start chatting.`
      : `${likerName} liked your profile on VivaahAI. Login to view their profile.`,
  });
}

export async function sendWelcomeEmail(email: string, fullName: string): Promise<void> {
  if (!isConfigured()) return;

  await createTransporter().sendMail({
    from: FROM,
    to: email,
    subject: `Welcome to VivaahAI, ${fullName}! 💕`,
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#f9f0f3;font-family:Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9f0f3;padding:40px 0;">
          <tr><td align="center">
            <table width="480" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(107,27,61,0.08);">
              <tr>
                <td style="background:#6B1B3D;padding:28px 32px;text-align:center;">
                  <span style="color:#D4AF37;font-size:22px;font-weight:800;letter-spacing:1px;">❤ VivaahAI</span>
                </td>
              </tr>
              <tr>
                <td style="padding:36px 32px;">
                  <h2 style="margin:0 0 8px;color:#1a1a1a;font-size:20px;">Welcome, ${fullName}! 🎉</h2>
                  <p style="margin:0 0 16px;color:#666;font-size:14px;line-height:1.6;">
                    Your account is ready. Complete your profile to start finding your perfect match.
                  </p>
                  <p style="margin:0;color:#666;font-size:14px;line-height:1.6;">
                    Wishing you the best on your journey. 💕
                  </p>
                </td>
              </tr>
              <tr>
                <td style="background:#fdf6f9;padding:16px 32px;text-align:center;border-top:1px solid #f0e0e8;">
                  <p style="margin:0;color:#aaa;font-size:12px;">© ${new Date().getFullYear()} VivaahAI</p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `,
    text: `Welcome to VivaahAI, ${fullName}! Your account is ready. Complete your profile to start finding your perfect match.`,
  });
}
