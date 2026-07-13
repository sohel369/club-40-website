import React, { createContext, useState, useContext, useEffect } from 'react';
import { DICTIONARY } from '../translations/dictionary.js';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  // Try to load language preference from localStorage, default is 'bn'
  const [language, setLanguageState] = useState(() => {
    const savedLang = localStorage.getItem('language');
    return savedLang === 'en' || savedLang === 'bn' ? savedLang : 'bn';
  });

  const setLanguage = (lang) => {
    if (lang === 'en' || lang === 'bn') {
      setLanguageState(lang);
      localStorage.setItem('language', lang);
    }
  };

  // Translation helper function
  const t = (key) => {
    const langDict = DICTIONARY[language] || DICTIONARY.bn;
    return langDict[key] !== undefined ? langDict[key] : key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
