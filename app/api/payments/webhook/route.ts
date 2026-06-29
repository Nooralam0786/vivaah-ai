/**
 * POST /api/payments/webhook
 * Razorpay webhook — handles payment.captured and payment.failed events.
 *
 * Setup in Razorpay Dashboard:
 *   Settings → Webhooks → Add URL: https://yourdomain.com/api/payments/webhook
 *   Events: payment.captured, payment.failed, subscription.charged, subscription.cancelled
 *   Secret: set RAZORPAY_WEBHOOK_SECRET in .env.local
 */

import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/db';
import { sendPaymentReceiptEmail } from '@/lib/email';
import { TIER_AMOUNTS } from '@/lib/razorpay';

/* Razorpay sends raw body for signature verification — must use text() not json() */
export const config = { api: { bodyParser: false } };

function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET ?? '';
  if (!secret) {
    console.warn('[Webhook] RAZORPAY_WEBHOOK_SECRET not set — skipping signature verification in dev');
    return true;
  }
  const expected = crypto.createHmac('sha256', secret).update(rawBody).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export async function POST(req: NextRequest) {
  const rawBody  = await req.text();
  const signature = req.headers.get('x-razorpay-signature') ?? '';

  if (!verifyWebhookSignature(rawBody, signature)) {
    console.error('[Webhook] Invalid signature');
    return NextResponse.json({ success: false, error: 'Invalid signature' }, { status: 400 });
  }

  let event: { event: string; payload: Record<string, unknown> };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 });
  }

  const eventType = event.event;
  console.log(`[Webhook] Event: ${eventType}`);

  /* ── payment.captured ─────────────────────────────────────── */
  if (eventType === 'payment.captured') {
    const payment = (event.payload as { payment?: { entity?: Record<string, unknown> } }).payment?.entity;
    if (!payment) return ok();

    const orderId   = payment.order_id as string;
    const paymentId = payment.id        as string;

    /* Find subscription by razorpayOrderId */
    const sub = await prisma.subscription.findFirst({
      where: { razorpayOrderId: orderId },
      include: { user: true },
    });

    if (!sub) {
      console.warn(`[Webhook] No subscription found for order ${orderId}`);
      return ok();
    }

    if (sub.status === 'active') return ok(); /* already processed */

    const now       = new Date();
    const expiresAt = new Date(now);
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    await prisma.$transaction([
      prisma.subscription.updateMany({
        where: { userId: sub.userId, status: 'active' },
        data:  { status: 'cancelled' },
      }),
      prisma.subscription.update({
        where: { id: sub.id },
        data:  {
          status:            'active',
          razorpayPaymentId: paymentId,
          startedAt:         now,
          expiresAt,
        },
      }),
      prisma.user.update({
        where: { id: sub.userId },
        data:  { onboardingStep: 'complete' },
      }),
    ]);

    sendPaymentReceiptEmail(
      sub.user.email,
      sub.user.fullName,
      sub.tier,
      TIER_AMOUNTS[sub.tier] ?? sub.amount,
      paymentId,
      expiresAt.toISOString(),
    ).catch(() => {});

    console.log(`[Webhook] Subscription activated: ${sub.id} (${sub.tier})`);
  }

  /* ── payment.failed ───────────────────────────────────────── */
  if (eventType === 'payment.failed') {
    const payment = (event.payload as { payment?: { entity?: Record<string, unknown> } }).payment?.entity;
    const orderId = payment?.order_id as string | undefined;

    if (orderId) {
      await prisma.subscription.updateMany({
        where: { razorpayOrderId: orderId, status: 'pending' },
        data:  { status: 'failed' },
      });
      console.log(`[Webhook] Payment failed for order ${orderId}`);
    }
  }

  /* ── subscription.cancelled ───────────────────────────────── */
  if (eventType === 'subscription.cancelled') {
    const sub = (event.payload as { subscription?: { entity?: Record<string, unknown> } }).subscription?.entity;
    const razorpaySubId = sub?.id as string | undefined;

    if (razorpaySubId) {
      await prisma.subscription.updateMany({
        where: { razorpayOrderId: razorpaySubId, status: 'active' },
        data:  { status: 'cancelled' },
      });
    }
  }

  return ok();
}

function ok() {
  return NextResponse.json({ success: true });
}
