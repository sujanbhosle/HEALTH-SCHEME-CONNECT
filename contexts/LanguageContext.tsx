
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { translations, Language, TranslationKey } from '../data/translations';

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
  t: (key: TranslationKey, ...args: (string | number)[]) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const storedLang = typeof window !== 'undefined' ? localStorage.getItem('language') : null;
    return (storedLang as Language) || 'en';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('language', language);
    }
  }, [language]);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  const t = (key: TranslationKey, ...args: (string | number)[]): string => {
    let translation = translations[language]?.[key] || translations['en'][key] || key;
    if (args.length > 0) {
      args.forEach((arg, index) => {
        const placeholder = new RegExp(`\\{${index}\\}`, 'g');
        translation = translation.replace(placeholder, String(arg));
      });
    }
    return translation;
  };
  

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
