/**
 * Client-side photo upload utility.
 * Resizes images in the browser, then uploads to S3 via presigned URL.
 */

export function resizeImageToBlob(
  file: File,
  maxDimension = 480,
  quality = 0.85,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That file is not a valid image'));
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width  = Math.round(img.width  * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Image processing not supported in this browser')); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => { blob ? resolve(blob) : reject(new Error('Image conversion failed')); },
          'image/jpeg',
          quality,
        );
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Resizes `file`, uploads to S3 via presigned URL, and returns the public URL.
 * Throws with a human-readable message on any failure.
 */
export async function uploadPhotoToS3(
  file: File,
  token: string,
  maxDimension = 480,
): Promise<string> {
  const blob = await resizeImageToBlob(file, maxDimension);

  const presignRes = await fetch('/api/upload/presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ contentType: 'image/jpeg' }),
  });

  if (!presignRes.ok) {
    const json = await presignRes.json().catch(() => ({})) as { error?: { message?: string } };
    throw new Error(json?.error?.message ?? 'Failed to get upload URL');
  }

  const { data: { uploadUrl, publicUrl } } = await presignRes.json() as {
    data: { uploadUrl: string; publicUrl: string; key: string };
  };

  const s3Res = await fetch(uploadUrl, {
    method: 'PUT',
    body: blob,
    headers: { 'Content-Type': 'image/jpeg' },
  });

  if (!s3Res.ok) throw new Error('Failed to upload image to cloud storage');

  return publicUrl;
}
