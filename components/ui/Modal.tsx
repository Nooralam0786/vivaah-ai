'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidthClassName?: string;
  ariaLabel?: string;
  hideCloseButton?: boolean;
}

/** Shared accessible modal/dialog shell — used for confirm/edit/create dialogs across admin & dashboard. */
export default function Modal({
  open,
  onClose,
  title,
  children,
  maxWidthClassName = 'max-w-md',
  ariaLabel,
  hideCloseButton,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? title}
        tabIndex={-1}
        className={`relative w-full ${maxWidthClassName} max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl outline-none`}
      >
        {(title || !hideCloseButton) && (
          <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-gray-100">
            {title && <h2 className="text-base font-bold text-gray-900">{title}</h2>}
            {!hideCloseButton && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="ml-auto w-7 h-7 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors focus-visible:ring-2 focus-visible:ring-primary-700/40"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
