"use client";

import { useState, useEffect } from 'react';
import { Locale, getDictionary, type Dictionary } from '@/lib/i18n';
import { locales } from '@/lib/i18n/config';

export function useDictionary(): Dictionary {
  const [dictionary, setDictionary] = useState<Dictionary>(getDictionary('fr'));

  useEffect(() => {
    // Get initial locale from localStorage
    const getLocaleFromStorage = (): Locale => {
      if (typeof window !== 'undefined') {
        const storedLocale = localStorage.getItem('m3allam-locale') as Locale;
        if (storedLocale && locales.includes(storedLocale)) {
          return storedLocale;
        }
      }
      return 'fr';
    };

    // Set initial dictionary
    const locale = getLocaleFromStorage();
    setDictionary(getDictionary(locale));

    // Listen for locale changes
    const handleLocaleChange = () => {
      const newLocale = getLocaleFromStorage();
      setDictionary(getDictionary(newLocale));
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('localeChange', handleLocaleChange);
      
      return () => {
        window.removeEventListener('localeChange', handleLocaleChange);
      };
    }
  }, []);

  return dictionary;
}
