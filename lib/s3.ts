/**
 * Server-side S3 helpers.
 * Only import this in app/api/** routes — never in client components.
 */

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { randomUUID } from 'crypto';

const REGION = process.env.AWS_REGION || 'ap-south-1';
const BUCKET = process.env.AWS_S3_BUCKET || 'vivaah-photos';
const CDN    = process.env.AWS_CLOUDFRONT_URL;

function client() {
  return new S3Client({
    region: REGION,
    credentials: {
      accessKeyId:     process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  });
}

export function isS3Configured(): boolean {
  return !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY && process.env.AWS_S3_BUCKET);
}

export function getPublicUrl(key: string): string {
  return CDN
    ? `${CDN.replace(/\/$/, '')}/${key}`
    : `https://${BUCKET}.s3.${REGION}.amazonaws.com/${key}`;
}

export async function createPresignedUploadUrl(
  userId: string,
  contentType: string,
): Promise<{ uploadUrl: string; publicUrl: string; key: string }> {
  const ext = contentType.split('/')[1]?.replace('jpeg', 'jpg') ?? 'jpg';
  const key = `photos/${userId}/${randomUUID()}.${ext}`;

  const command = new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: contentType });
  const uploadUrl = await getSignedUrl(client(), command, { expiresIn: 300 });

  return { uploadUrl, publicUrl: getPublicUrl(key), key };
}

export async function deleteS3Object(key: string): Promise<void> {
  await client().send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
}
