/**
 * POST /api/upload/presign
 * Returns a short-lived S3 presigned PUT URL so the client can upload
 * an image directly to S3 without routing the bytes through this server.
 *
 * Body:  { contentType: "image/jpeg" | "image/png" | "image/webp" }
 * Returns: { uploadUrl, publicUrl, key }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getUserIdFromRequest } from '@/lib/jwt';
import { createPresignedUploadUrl, isS3Configured } from '@/lib/s3';

const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function POST(req: NextRequest) {
  if (!isS3Configured()) {
    return NextResponse.json(
      { success: false, error: { code: 'S3_NOT_CONFIGURED', message: 'Cloud storage is not configured. Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, and AWS_S3_BUCKET in your environment.' } },
      { status: 503 },
    );
  }

  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in to continue' } },
      { status: 401 },
    );
  }

  const body = await req.json().catch(() => ({}));
  const contentType: unknown = body?.contentType;

  if (typeof contentType !== 'string' || !ALLOWED.has(contentType)) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'contentType must be image/jpeg, image/png, or image/webp' } },
      { status: 400 },
    );
  }

  try {
    const result = await createPresignedUploadUrl(userId, contentType);
    return NextResponse.json({
      success: true,
      data: result,
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('[POST /api/upload/presign]', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to generate upload URL' } },
      { status: 500 },
    );
  }
}
