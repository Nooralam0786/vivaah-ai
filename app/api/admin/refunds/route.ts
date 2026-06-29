/**
 * POST /api/admin/refunds — issue a Razorpay refund for a subscription.
 * GET  /api/admin/refunds — list all subscriptions eligible for refund.
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { razorpay } from '@/lib/razorpay';
import { getAdminOrReject } from '@/lib/admin-auth';

const refundSchema = z.object({
  subscriptionId: z.string(),
  amount:         z.number().optional(), /* partial refund in paise — omit for full */
  reason:         z.string().default('customer_request'),
});

export async function GET(req: NextRequest) {
  const admin = await getAdminOrReject(req);
  const adminErr = admin.ok ? null : admin.res;
  if (adminErr) return adminErr;

  const subs = await prisma.subscription.findMany({
    where:   { status: 'active', razorpayPaymentId: { not: null } },
    include: { user: { select: { fullName: true, email: true, phone: true } } },
    orderBy: { createdAt: 'desc' },
    take:    100,
  });

  return NextResponse.json({
    success: true,
    data: subs.map((s) => ({
      id:               s.id,
      userId:           s.userId,
      userName:         s.user.fullName,
      userEmail:        s.user.email,
      tier:             s.tier,
      amount:           s.amount,
      razorpayPaymentId: s.razorpayPaymentId,
      startedAt:        s.startedAt,
      expiresAt:        s.expiresAt,
      createdAt:        s.createdAt,
    })),
  });
}

export async function POST(req: NextRequest) {
  const admin = await getAdminOrReject(req);
  const adminErr = admin.ok ? null : admin.res;
  if (adminErr) return adminErr;

  const body   = await req.json().catch(() => ({}));
  const parsed = refundSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'subscriptionId required' } },
      { status: 400 },
    );
  }

  const { subscriptionId, amount, reason } = parsed.data;

  const sub = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
  if (!sub || !sub.razorpayPaymentId) {
    return NextResponse.json(
      { success: false, error: { code: 'NOT_FOUND', message: 'Subscription not found or no payment ID' } },
      { status: 404 },
    );
  }

  try {
    const refund = await razorpay.payments.refund(sub.razorpayPaymentId, {
      amount: amount ?? sub.amount,
      speed:  'normal',
      notes:  { reason, subscriptionId, initiatedBy: 'admin' },
    });

    /* Mark subscription cancelled */
    await prisma.subscription.update({
      where: { id: subscriptionId },
      data:  { status: 'cancelled' },
    });

    return NextResponse.json({
      success: true,
      data: {
        refundId: refund.id,
        amount:   refund.amount,
        status:   refund.status,
      },
    });
  } catch (err) {
    console.error('[Admin Refunds] Razorpay refund failed:', err);
    return NextResponse.json(
      { success: false, error: { code: 'REFUND_FAILED', message: 'Razorpay refund failed. Check payment ID.' } },
      { status: 502 },
    );
  }
}
