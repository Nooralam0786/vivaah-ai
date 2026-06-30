import Razorpay from 'razorpay';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('[Razorpay] Keys not set — payments will fail. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local');
}

export const razorpay = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID     ?? '',
  key_secret: process.env.RAZORPAY_KEY_SECRET ?? '',
});

export const TIER_AMOUNTS: Record<string, number> = {
  gold:     49900,  // ₹499 in paise
  platinum: 99900,  // ₹999 in paise
  diamond:  249900, // ₹2499 in paise
};

export const TIER_LABELS: Record<string, string> = {
  gold:     'Gold Plan',
  platinum: 'Platinum Plan',
  diamond:  'Diamond Plan',
};
