import React, { useState, useCallback } from 'react';
import { useTranslations } from '../hooks/useTranslations';

interface ImageUploaderProps {
  id: string;
  label: string;
  description: string;
  preview: string | null;
  onFileSelect: (file: File) => void;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M12 15l-3-3m0 0l3-3m-3 3h12" />
    </svg>
);


export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, description, preview, onFileSelect }) => {
  const [isDragging, setIsDragging] = useState(false);
  const t = useTranslations();

  const handleFile = useCallback((file: File | null) => {
    if (file && file.type.startsWith('image/')) {
        onFileSelect(file);
    }
  }, [onFileSelect]);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
            const file = items[i].getAsFile();
            if (file) {
                handleFile(file);
                break; 
            }
        }
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const uploaderClasses = `w-full h-96 bg-slate-900/50 rounded-xl border-2 border-dashed flex items-center justify-center relative overflow-hidden group transition-all duration-300 ${
    isDragging ? 'border-indigo-500 bg-indigo-900/20' : 'border-slate-700'
  }`;

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-xl font-semibold text-slate-300 mb-2">{label}</h3>
      <p className="text-sm text-slate-400 mb-4">{description}</p>
      <div 
        className={uploaderClasses}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onPaste={handlePaste}
        tabIndex={0}
      >
        {preview ? (
          <>
            <img src={preview} alt={t.uploader.previewAlt} className="w-full h-full object-cover" />
            <label htmlFor={id} className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              {t.uploader.changeImage}
            </label>
          </>
        ) : (
          <div className="text-center p-4">
            <UploadIcon />
            <p className="mt-2 font-semibold text-indigo-400">{t.uploader.clickToUpload}</p>
            <p className="text-slate-400">{t.uploader.dragAndDrop}</p>
            <p className="text-xs text-slate-500 mt-1">{t.uploader.paste}</p>
          </div>
        )}
        <input
          id={id}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
};