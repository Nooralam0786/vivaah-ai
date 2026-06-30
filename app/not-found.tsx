import Link from 'next/link';
import { HeartCrack } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-5">
          <HeartCrack className="w-8 h-8 text-primary-700" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-neutral-900">Page not found</h1>
        <p className="mt-2 text-sm text-neutral-500">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <Link href="/" className="btn btn-primary mt-6 px-5 py-2.5">
          Back to home
        </Link>
      </div>
    </div>
  );
}
