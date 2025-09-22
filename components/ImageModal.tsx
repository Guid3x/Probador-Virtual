import React, { useEffect } from 'react';
import { useTranslations } from '../hooks/useTranslations';

interface ImageModalProps {
  imageSrc: string;
  onClose: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ imageSrc, onClose }) => {
  const t = useTranslations();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
      <div className="relative max-w-4xl max-h-full" onClick={(e) => e.stopPropagation()}>
        <img src={imageSrc} alt={t.modal.alt} className="w-auto h-auto max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl" />
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 bg-slate-700 text-white rounded-full h-10 w-10 flex items-center justify-center text-2xl font-bold hover:bg-slate-600 transition transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label={t.modal.closeAriaLabel}
        >
          &times;
        </button>
      </div>
    </div>
  );
};