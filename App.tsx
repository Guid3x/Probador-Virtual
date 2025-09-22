import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ResultGallery } from './components/ResultGallery';
import { ImageModal } from './components/ImageModal';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { generateVirtualTryOnImages } from './services/geminiService';
import { LanguageProvider } from './contexts/LanguageContext';
import { useTranslations } from './hooks/useTranslations';
import type { AppStatus } from './types';
import { Status } from './types';

const AppContent: React.FC = () => {
  const [personImage, setPersonImage] = useState<File | null>(null);
  const [clothingImage, setClothingImage] = useState<File | null>(null);
  const [personImagePreview, setPersonImagePreview] = useState<string | null>(null);
  const [clothingImagePreview, setClothingImagePreview] = useState<string | null>(null);
  
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [status, setStatus] = useState<AppStatus>(Status.Idle);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const t = useTranslations();

  const handleImageUpload = (
    file: File,
    setImage: React.Dispatch<React.SetStateAction<File | null>>,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
  };

  const handleReset = useCallback(() => {
    setPersonImage(null);
    setClothingImage(null);
    setPersonImagePreview(null);
    setClothingImagePreview(null);
    setGeneratedImages([]);
    setStatus(Status.Idle);
    setError(null);
    setLoadingMessage('');
  }, []);

  const handleSubmit = async () => {
    if (!personImage || !clothingImage) {
      setError(t.error.missingImages);
      return;
    }

    setStatus(Status.Loading);
    setError(null);
    setGeneratedImages([]);

    const updateLoadingMessage = (key: string, context: Record<string, string | number> = {}) => {
      let message = t.status[key] || "Processing...";
      for (const [k, v] of Object.entries(context)) {
        message = message.replace(`{{${k}}}`, String(v));
      }
      setLoadingMessage(message);
    }

    try {
      updateLoadingMessage('preparing');
      const images = await generateVirtualTryOnImages(personImage, clothingImage, updateLoadingMessage);
      setGeneratedImages(images);
      setStatus(Status.Success);
    } catch (err) {
      console.error(err);
      const errorMessage = err instanceof Error ? err.message : t.error.unknown;
      setError(`${t.error.generationFailed}: ${errorMessage}`);
      setStatus(Status.Error);
    }
  };
  
  const isButtonDisabled = !personImage || !clothingImage || status === Status.Loading;

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 flex flex-col items-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-6xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              {t.header.title}
            </h1>
            <p className="mt-2 text-lg text-slate-400 max-w-2xl">
              {t.header.subtitle}
            </p>
          </div>
          <LanguageSwitcher />
        </header>

        <main className="bg-slate-800/50 rounded-2xl shadow-2xl shadow-indigo-900/10 p-6 sm:p-10 border border-slate-700">
          {status === Status.Loading ? (
            <div className="flex flex-col items-center justify-center text-center h-96">
              <LoadingSpinner />
              <p className="mt-6 text-xl font-semibold text-slate-100">{loadingMessage}</p>
              <p className="mt-2 text-slate-400">{t.status.patience}</p>
            </div>
          ) : (
            <>
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 ${status === Status.Success ? 'md:grid-cols-2' : ''}`}>
                 {status === Status.Success && personImagePreview ? (
                   <div className="flex flex-col items-center">
                        <h3 className="text-xl font-semibold text-slate-300 mb-4">{t.uploader.yourPhoto}</h3>
                        <div className="w-full max-w-sm h-96 rounded-xl overflow-hidden shadow-lg border border-slate-700">
                            <img src={personImagePreview} alt={t.uploader.personAlt} className="w-full h-full object-cover" />
                        </div>
                    </div>
                ) : (
                  <ImageUploader
                    id="person-image"
                    label={t.uploader.personLabel}
                    description={t.uploader.personDescription}
                    preview={personImagePreview}
                    onFileSelect={(file) => handleImageUpload(file, setPersonImage, setPersonImagePreview)}
                  />
                )}
                
                {status === Status.Success && clothingImagePreview ? (
                   <div className="flex flex-col items-center">
                        <h3 className="text-xl font-semibold text-slate-300 mb-4">{t.uploader.clothingLabel}</h3>
                        <div className="w-full max-w-sm h-96 rounded-xl overflow-hidden shadow-lg border border-slate-700">
                            <img src={clothingImagePreview} alt={t.uploader.clothingAlt} className="w-full h-full object-cover" />
                        </div>
                    </div>
                ) : (
                  <ImageUploader
                    id="clothing-image"
                    label={t.uploader.clothingLabel}
                    description={t.uploader.clothingDescription}
                    preview={clothingImagePreview}
                    onFileSelect={(file) => handleImageUpload(file, setClothingImage, setClothingImagePreview)}
                  />
                )}
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative mb-6" role="alert">
                  <strong className="font-bold">{t.error.title}</strong>
                  <span className="block sm:inline ml-2">{error}</span>
                </div>
              )}

              {status !== Status.Success && (
                <div className="text-center mt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isButtonDisabled}
                    className="w-full sm:w-auto bg-indigo-600 text-white font-bold py-4 px-12 rounded-xl text-lg hover:bg-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed disabled:transform-none transition-all duration-300 transform hover:scale-105"
                  >
                    {t.buttons.generate}
                  </button>
                </div>
              )}

              {status === Status.Success && (
                <div className="mt-10">
                  <h2 className="text-3xl font-bold text-center text-white mb-8">{t.results.title}</h2>
                  <ResultGallery images={generatedImages} onImageClick={setSelectedImage} />
                  <div className="text-center mt-10">
                    <button
                      onClick={handleReset}
                      className="bg-slate-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-slate-600 focus:outline-none focus:ring-4 focus:ring-slate-500/50 transition-transform transform hover:scale-105"
                    >
                      {t.buttons.createAnother}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        <footer className="text-center mt-12 text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} {t.footer.copyright}</p>
        </footer>
      </div>
      {selectedImage && <ImageModal imageSrc={selectedImage} onClose={() => setSelectedImage(null)} />}
    </div>
  );
};


const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;