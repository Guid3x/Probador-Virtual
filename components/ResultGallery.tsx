import React from 'react';
import { useTranslations } from '../hooks/useTranslations';

interface ResultGalleryProps {
  images: string[];
  onImageClick: (image: string) => void;
}

export const ResultGallery: React.FC<ResultGalleryProps> = ({ images, onImageClick }) => {
  const t = useTranslations();
  
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {images.map((image, index) => (
        <button 
          key={index} 
          onClick={() => onImageClick(image)}
          className="block w-full text-left bg-slate-800 rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 group"
          aria-label={`${t.results.ariaLabel} ${index + 1}`}
        >
          <div className="aspect-[3/4] overflow-hidden">
             <img
              src={image}
              alt={`${t.results.poseAlt} ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
           <div className="p-4 bg-slate-900/50">
             <h4 className="text-lg font-semibold text-slate-200 group-hover:text-indigo-400 transition-colors">{t.results.pose} {index + 1}</h4>
           </div>
        </button>
      ))}
    </div>
  );
};