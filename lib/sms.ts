/**
 * SMS delivery via Twilio.
 * Falls back to console logging when credentials are not configured (dev/test).
 */

import twilio from 'twilio';

function isConfigured(): boolean {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_PHONE_NUMBER
  );
}

export async function sendOtpSms(phone: string, otp: string): Promise<void> {
  if (!isConfigured()) {
    console.log(`\n========================================`);
    console.log(`  [SMS not configured — dev fallback]`);
    console.log(`  OTP for ${phone}: ${otp}`);
    console.log(`  Set TWILIO_* env vars to enable real SMS`);
    console.log(`========================================\n`);
    return;
  }

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID!,
    process.env.TWILIO_AUTH_TOKEN!,
  );

  await client.messages.create({
    from: process.env.TWILIO_PHONE_NUMBER!,
    to: `+91${phone}`,
    body: `${otp} is your VivaahAI verification code. Valid for 10 minutes. Do not share this with anyone.`,
  });
}
