import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import ru from './locales/ru';
import uz from './locales/uz';

i18n
    .use(LanguageDetector)
    .init({
        fallbackLng: 'ru',
        debug: process.env.NODE_ENV === 'development',
        interpolation: {
            escapeValue: true
        },
        react: {
            wait: true
        },
        resources: {
            ru,
            uz
        },
        defaultNS: ["translations"],
      lng: 'ru',
    })
;

export default i18n;
