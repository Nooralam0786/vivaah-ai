'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { UploadCloud, X, ImagePlus, MoveRight, CheckCircle2, Camera } from 'lucide-react';
import { uploadPhotoToS3 } from '@/lib/upload';

const MAX_PHOTOS = 6;
const MIN_PHOTOS = 1;
const MAX_SIZE_MB = 5;

interface PhotoItem { url: string; file: File }

export default function PhotoUploadPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [dragging, setDragging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((files: File[]) => {
    setError('');
    const valid: File[] = [];
    for (const f of files) {
      if (!f.type.startsWith('image/')) { setError('Only image files are allowed'); continue; }
      if (f.size > MAX_SIZE_MB * 1024 * 1024) { setError(`Each image must be under ${MAX_SIZE_MB}MB`); continue; }
      valid.push(f);
    }
    if (!valid.length) return;
    const slots = MAX_PHOTOS - photos.length;
    const toAdd = valid.slice(0, slots);
    const newItems: PhotoItem[] = toAdd.map((f) => ({ url: URL.createObjectURL(f), file: f }));
    setPhotos((p) => [...p, ...newItems]);
  }, [photos.length]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  }, [processFiles]);

  const onRemove = (idx: number) => {
    setPhotos((p) => { URL.revokeObjectURL(p[idx].url); return p.filter((_, i) => i !== idx); });
  };

  const handleFinish = async () => {
    if (photos.length < MIN_PHOTOS) { setError('Please add at least 1 photo to continue'); return; }
    setSaving(true); setError('');
    try {
      const auth = JSON.parse(localStorage.getItem('vivaah_auth') || '{}');
      const token: string = auth.accessToken;

      const urls: string[] = [];
      for (let i = 0; i < photos.length; i++) {
        setUploadProgress(`Uploading photo ${i + 1} of ${photos.length}…`);
        const url = await uploadPhotoToS3(photos[i].file, token, 800);
        urls.push(url);
      }
      setUploadProgress('');

      // Save photos to profile
      await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ photos: urls, photo: urls[0] }),
      });

      await refreshUser();
      router.push('/select-plan');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload photos. Please try again.');
      setUploadProgress('');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF0F3] via-white to-[#FFF8F0] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <p className="text-xs font-semibold text-[#7A0026] uppercase tracking-wider mb-1">Step 5 of 5 — Photos</p>
          <h1 className="text-2xl font-extrabold text-neutral-900">Add Your Photos</h1>
          <p className="text-sm text-neutral-500 mt-1">Profiles with photos get up to 10× more matches</p>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-neutral-200 rounded-full h-2 mb-6">
          <div className="bg-[#7A0026] h-2 rounded-full w-full transition-all duration-500" />
        </div>

        <div className="bg-white rounded-3xl shadow-2xl shadow-[#7A0026]/8 p-6 sm:p-8">
          {/* Drop zone */}
          {photos.length < MAX_PHOTOS && (
            <div
              onDrop={onDrop}
              onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onClick={() => inputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all mb-6
                ${dragging ? 'border-[#7A0026] bg-[#FAF0F3]' : 'border-neutral-200 hover:border-[#7A0026]/40 hover:bg-neutral-50'}`}
            >
              <input
                ref={inputRef}
                type="file" multiple accept="image/*"
                className="hidden"
                onChange={(e) => processFiles(Array.from(e.target.files ?? []))}
              />
              <div className="w-14 h-14 bg-[#FAF0F3] rounded-2xl flex items-center justify-center mx-auto mb-3">
                {dragging ? <ImagePlus className="w-7 h-7 text-[#7A0026]" /> : <UploadCloud className="w-7 h-7 text-[#7A0026]" />}
              </div>
              <p className="font-semibold text-neutral-700 mb-1">{dragging ? 'Drop your photos here' : 'Drag & drop photos here'}</p>
              <p className="text-sm text-neutral-400">or click to browse files</p>
              <p className="text-xs text-neutral-300 mt-2">JPG, PNG, WEBP — max {MAX_SIZE_MB}MB each — up to {MAX_PHOTOS} photos</p>
            </div>
          )}

          {/* Photo grid */}
          {photos.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold text-neutral-700">{photos.length} photo{photos.length !== 1 ? 's' : ''} added</p>
                {photos.length < MAX_PHOTOS && (
                  <button onClick={() => inputRef.current?.click()} className="text-xs text-[#7A0026] font-semibold hover:underline flex items-center gap-1">
                    <Camera className="w-3 h-3" /> Add More
                  </button>
                )}
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {photos.map((p, i) => (
                  <div key={p.url} className="relative aspect-square rounded-xl overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={p.url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                    {i === 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-[#7A0026]/80 text-white text-[10px] font-bold text-center py-0.5">
                        Main Photo
                      </div>
                    )}
                    <button
                      onClick={() => onRemove(i)}
                      className="absolute top-1.5 right-1.5 w-6 h-6 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow"
                    >
                      <X className="w-3.5 h-3.5 text-neutral-700" />
                    </button>
                  </div>
                ))}
                {/* Empty slot hints */}
                {Array.from({ length: Math.min(2, MAX_PHOTOS - photos.length) }).map((_, i) => (
                  <button key={i} onClick={() => inputRef.current?.click()} className="aspect-square rounded-xl border-2 border-dashed border-neutral-200 flex items-center justify-center hover:border-[#7A0026]/40 transition-colors">
                    <ImagePlus className="w-6 h-6 text-neutral-300" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tips */}
          <div className="bg-[#FAF0F3] rounded-xl p-4 mb-6">
            <p className="text-xs font-bold text-[#7A0026] mb-2">Photo Tips</p>
            <ul className="space-y-1 text-xs text-neutral-600">
              {['Use a clear face photo as your main photo', 'Avoid sunglasses, group photos, or blurry images', 'Smile — it makes a great first impression!', 'Add photos that show your personality'].map((t) => (
                <li key={t} className="flex items-start gap-1.5">
                  <CheckCircle2 className="w-3 h-3 text-[#7A0026] mt-0.5 flex-shrink-0" />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 mb-4">{error}</div>}

          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/profile-wizard')}
              className="text-sm text-neutral-500 hover:text-[#7A0026] font-medium transition-colors"
            >
              ← Back to Profile
            </button>

            <button
              onClick={handleFinish}
              disabled={saving || photos.length === 0}
              className="flex items-center gap-2 px-6 py-3 bg-[#7A0026] hover:bg-[#A10035] text-white rounded-xl text-sm font-bold transition-all disabled:opacity-60"
            >
              {saving ? (
                <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : <MoveRight className="w-4 h-4" />}
              {uploadProgress || (saving ? 'Finishing…' : 'Finish & Go to Dashboard')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
