import { Locale, defaultLocale } from './config';

// Import dictionaries
import frDictionary from './dictionaries/fr.json';
import enDictionary from './dictionaries/en.json';

export const dictionaries = {
  fr: frDictionary,
  en: enDictionary,
} as const;

// Étendre le type pour inclure home explicitement
type BaseDictionary = typeof frDictionary;

export type Dictionary = BaseDictionary;
export type { Locale, defaultLocale };

export const getDictionary = (locale: Locale): Dictionary => {
  return dictionaries[locale] || dictionaries.fr;
};
