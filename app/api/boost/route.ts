import { NextRequest, NextResponse } from 'next/server';
import { createHmac } from 'crypto';
import { prisma } from '@/lib/db';
import { getUserIdFromRequest } from '@/lib/jwt';
import { razorpay } from '@/lib/razorpay';
import { writeApiLimit } from '@/lib/api-rate-limit';

const BOOST_AMOUNT_PAISE = 9900; // ₹99
const BOOST_DAYS         = 7;

/* POST /api/boost/create-order */
export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }

  const rl = await writeApiLimit(req, `boost:${userId}`);
  if (rl) return rl;

  const body = await req.json() as {
    action?: string;
    razorpay_order_id?: string;
    razorpay_payment_id?: string;
    razorpay_signature?: string;
  };
  const { action } = body;

  // ── Create Razorpay order ────────────────────────────────────────────────
  if (!action || action === 'create-order') {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { fullName: true, email: true } });

    const order = await razorpay.orders.create({
      amount:   BOOST_AMOUNT_PAISE,
      currency: 'INR',
      receipt:  `boost_${userId}_${Date.now()}`,
      notes:    { userId, type: 'profile_boost' },
    });

    return NextResponse.json({
      success: true,
      data: {
        orderId:     order.id,
        amount:      BOOST_AMOUNT_PAISE,
        currency:    'INR',
        keyId:       process.env.RAZORPAY_KEY_ID,
        description: 'Profile Boost — 7 days',
        prefill:     { name: user?.fullName, email: user?.email },
      },
    });
  }

  // ── Verify payment & activate boost ──────────────────────────────────────
  if (action === 'verify') {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const secret = process.env.RAZORPAY_KEY_SECRET ?? '';
    const expected = createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expected !== razorpay_signature) {
      return NextResponse.json({ success: false, error: { code: 'INVALID_SIGNATURE' } }, { status: 400 });
    }

    const boostExpiresAt = new Date(Date.now() + BOOST_DAYS * 24 * 60 * 60 * 1000);
    await prisma.profile.update({
      where: { userId },
      data:  { boostExpiresAt },
    });

    return NextResponse.json({ success: true, data: { boostExpiresAt } });
  }

  return NextResponse.json({ success: false, error: { code: 'INVALID_ACTION' } }, { status: 400 });
}

/* GET /api/boost — check boost status */
export async function GET(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json({ success: false, error: { code: 'UNAUTHORIZED' } }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where:  { userId },
    select: { boostExpiresAt: true },
  });

  const now     = new Date();
  const isActive = !!profile?.boostExpiresAt && profile.boostExpiresAt > now;
  const expiresAt = isActive ? profile?.boostExpiresAt : null;

  return NextResponse.json({ success: true, data: { isActive, expiresAt } });
}
