import React, { createContext, useState, useMemo } from 'react';
import { es } from '../i18n/es';
import { en } from '../i18n/en';

type Locale = 'es' | 'en';
type Translations = typeof es;

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  translations: Translations;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translationsMap = { es, en };

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>('es');

  const contextValue = useMemo(() => {
    return {
      locale,
      setLocale,
      translations: translationsMap[locale],
    };
  }, [locale]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
