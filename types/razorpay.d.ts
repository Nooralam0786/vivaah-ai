interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  image?: string;
  handler(r: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }): void;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  modal?: { ondismiss?(): void };
}

interface Window {
  Razorpay: new (opts: RazorpayOptions) => { open(): void };
}
