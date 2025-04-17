import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  en: {
    translation: {
      appTitle: 'SveaVida',
      appSubtitle: 'Swedish Presence in Portugal',
      categoriesHeader: 'Categories',
      loading: 'Loading...',
      visitWebsite: 'Visit Website',
      openHours: 'Opening Hours',
      location: 'Location',
      tags: 'Tags',
      socialMedia: 'Social Media',
      close: 'Close',
    },
  },
  se: {
    translation: {
      appTitle: 'SveaVida',
      appSubtitle: 'Svensk närvaro i Portugal',
      categoriesHeader: 'Kategorier',
      loading: 'Laddar...',
      visitWebsite: 'Besök webbplats',
      openHours: 'Öppettider',
      location: 'Plats',
      tags: 'Taggar',
      socialMedia: 'Sociala medier',
      close: 'Stäng',
    },
  },
  pt: {
    translation: {
      appTitle: 'SveaVida',
      appSubtitle: 'Presença Sueca em Portugal',
      categoriesHeader: 'Categorias',
      loading: 'Carregando...',
      visitWebsite: 'Visite o Website',
      openHours: 'Horário de Funcionamento',
      location: 'Localização',
      tags: 'Etiquetas',
      socialMedia: 'Redes Sociais',
      close: 'Fechar',
    },
  },
};

export const initializeI18n = () => {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'en',
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false, // React already escapes everything
      },
    });
};

export default i18n;
