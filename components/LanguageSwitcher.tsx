"use client";

import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { locales, type Locale, localeNames, localeFlags } from '@/lib/i18n/config';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const [currentLocale, setCurrentLocale] = useState<Locale>('fr');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Get locale from localStorage or default to 'fr'
      const storedLocale = localStorage.getItem('m3allam-locale') as Locale;
      
      if (storedLocale && locales.includes(storedLocale)) {
        setCurrentLocale(storedLocale);
      } else {
        setCurrentLocale('fr');
        localStorage.setItem('m3allam-locale', 'fr');
      }
    }
  }, []);

  const switchLanguage = (newLocale: Locale) => {
    // Only run on client side
    if (typeof window !== 'undefined') {
      // Store locale in localStorage
      localStorage.setItem('m3allam-locale', newLocale);
      setCurrentLocale(newLocale);
      
      // Trigger a re-render to update translations
      window.dispatchEvent(new Event('localeChange'));
    }
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{localeNames[currentLocale]}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-1">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => switchLanguage(locale)}
                className={`w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors ${
                  currentLocale === locale ? 'bg-green-50 text-green-700' : 'text-gray-700'
                }`}
              >
                <span className="text-2xl">{localeFlags[locale]}</span>
                <div>
                  <div className="font-medium">{localeNames[locale]}</div>
                  <div className="text-xs text-gray-500">{locale.toUpperCase()}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
