import i18n from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init(
    {
      backend: {
        loadPath: `/static/locales/{{ns}}/{{lng}}.json`,
      },
      fallbackLng: "geo",
      load: "languageOnly",
      supportedLngs: ["eng", "geo"],
      debug: false,
      ns: ["app", "auth", "admin", "components"],
      interpolation: {
        escapeValue: false,
        formatSeparator: ",",
      },
    },
    (err, t) => {
      if (err) return console.log("something went wrong loading", err);
      t("key");
    }
  );

export default i18n;
