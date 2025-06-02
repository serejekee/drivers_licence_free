import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
  // Плагин для загрузки переводов
  .use(Backend)
  // Плагин для определения языка
  .use(LanguageDetector)
  // Передаем экземпляр i18n в react-i18next
  .use(initReactI18next)
  // Инициализируем i18next
  .init({
    fallbackLng: 'en',
    debug: false,

    interpolation: {
      escapeValue: false, // не нужно для React
    },

    backend: {
      // путь к файлам переводов
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },

    detection: {
      // опции для определения языка
      order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
      caches: ['localStorage', 'cookie'],
    },
  });

export default i18n;
