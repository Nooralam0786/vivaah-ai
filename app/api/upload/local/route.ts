/**
 * POST /api/upload/local
 * Local-filesystem fallback when S3 is not configured (dev mode).
 * Saves the uploaded file to public/uploads/<userId>/ and returns
 * a relative public URL that Next.js serves statically.
 */

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { randomUUID } from 'crypto';
import { getUserIdFromRequest } from '@/lib/jwt';
import { uploadLimit } from '@/lib/api-rate-limit';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

export async function POST(req: NextRequest) {
  const userId = getUserIdFromRequest(req);
  if (!userId) {
    return NextResponse.json(
      { success: false, error: { code: 'UNAUTHORIZED', message: 'Please log in' } },
      { status: 401 },
    );
  }

  const rl = await uploadLimit(req, `upload:${userId}`);
  if (rl) return rl;

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'Expected multipart/form-data' } },
      { status: 400 },
    );
  }

  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'No file provided' } },
      { status: 400 },
    );
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'Only JPEG, PNG and WEBP images are allowed' } },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { success: false, error: { code: 'VALIDATION_ERROR', message: 'File must be under 5 MB' } },
      { status: 400 },
    );
  }

  try {
    const ext      = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const filename = `${randomUUID()}.${ext}`;
    const dir      = join(process.cwd(), 'public', 'uploads', userId);

    await mkdir(dir, { recursive: true });
    const bytes = await file.arrayBuffer();
    await writeFile(join(dir, filename), Buffer.from(bytes));

    const publicUrl = `/uploads/${userId}/${filename}`;

    return NextResponse.json({
      success: true,
      data: { publicUrl, key: `uploads/${userId}/${filename}` },
      meta: { timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('[POST /api/upload/local]', error);
    return NextResponse.json(
      { success: false, error: { code: 'SERVER_ERROR', message: 'Failed to save file' } },
      { status: 500 },
    );
  }
}
