import React, { useContext } from 'react';
import { LanguageContext } from '../contexts/LanguageContext';

export const LanguageSwitcher: React.FC = () => {
  const context = useContext(LanguageContext);

  if (!context) {
    return null;
  }

  const { locale, setLocale } = context;

  const buttonClasses = (lang: 'es' | 'en') =>
    `px-4 py-2 text-sm font-bold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-white ${
      locale === lang
        ? 'bg-indigo-600 text-white'
        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
    }`;

  return (
    <div className="flex items-center space-x-2 bg-slate-800 p-1 rounded-lg">
      <button onClick={() => setLocale('es')} className={buttonClasses('es')}>
        ES
      </button>
      <button onClick={() => setLocale('en')} className={buttonClasses('en')}>
        EN
      </button>
    </div>
  );
};
