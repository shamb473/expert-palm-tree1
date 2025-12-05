
import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Language } from '../types';

export const translations = {
  en: {
    nav: {
      home: 'Home',
      products: 'Products',
      advisory: 'Crop Advisory',
      advisor: 'Krushi Mitra AI',
      schemes: 'Govt Schemes',
      contact: 'Contact',
      login: 'Login',
      logout: 'Logout'
    },
    hero: {
      welcome: 'Welcome to',
      subtitle: 'The heart of agriculture. We provide premium seeds, fertilizers, and expert advice to help you grow more.',
      viewProducts: 'View Products',
      askAI: 'Ask Krushi Mitra AI',
      chatWhatsapp: 'Chat on WhatsApp',
      weather: 'Weather',
      mandiRates: 'Mandi Rates',
      bullion: 'Bullion',
      servicesTitle: 'Our Services',
      service1Title: 'Quality Inputs',
      service1Desc: 'Access the best seeds, fertilizers, and pesticides tailored for your soil and climate.',
      service2Title: 'Market Insights',
      service2Desc: 'Stay updated with real-time mandi rates from major markets to sell at the right price.',
      service3Title: 'Expert Guidance',
      service3Desc: 'Get personalized crop advice and disease solutions from our AI Krushi Mitra and local experts.',
      farmerAward: 'Farmers of the Year',
      supporting: 'Supporting Farmers Since 2012',
      detectLoc: 'Detect',
      locating: 'Locating...'
    },
    products: {
        title: 'Our Products',
        subtitle: 'Best quality seeds, fertilizers, and equipment',
        search: 'Search products...',
        addToCart: 'Add to Cart',
        buyNow: 'Buy Now',
        outOfStock: 'Out of Stock'
    }
  },
  mr: {
    nav: {
      home: 'मुख्यपृष्ठ',
      products: 'उत्पादने',
      advisory: 'पीक सल्ला',
      advisor: 'कृषी मित्र AI',
      schemes: 'शासकीय योजना',
      contact: 'संपर्क',
      login: 'लॉगिन',
      logout: 'बाहेर पडा'
    },
    hero: {
      welcome: 'स्वागत आहे',
      subtitle: 'शेतकऱ्यांचे हक्काचे कृषी केंद्र. आम्ही तुम्हाला अधिक उत्पादन घेण्यास मदत करण्यासाठी उत्तम बियाणे, खते आणि तज्ञांचा सल्ला देतो.',
      viewProducts: 'उत्पादने पहा',
      askAI: 'कृषी मित्र AI ला विचारा',
      chatWhatsapp: 'व्हॉट्सॲपवर चॅट करा',
      weather: 'हवामान',
      mandiRates: 'बाजार भाव',
      bullion: 'सोने-चांदी भाव',
      servicesTitle: 'आमच्या सेवा',
      service1Title: 'गुणवत्तापूर्ण कृषी निविष्ठा',
      service1Desc: 'तुमच्या भागातील हवामान आणि मातीसाठी योग्य बियाणे, खते आणि कीटकनाशके मिळवा.',
      service2Title: 'बाजार भाव',
      service2Desc: 'प्रमुख बाजारपेठांमधील ताज्या बाजार भावांची माहिती मिळवा.',
      service3Title: 'तज्ञांचे मार्गदर्शन',
      service3Desc: 'आमच्या कृषी मित्र AI आणि तज्ञांकडून पीक सल्ला आणि रोग निदानाची मदत घ्या.',
      farmerAward: 'शेतकरी पुरस्कार',
      supporting: '२०१२ पासून शेतकऱ्यांच्या सेवेत',
      detectLoc: 'स्थान शोधा',
      locating: 'शोधत आहे...'
    },
    products: {
        title: 'आमची उत्पादने',
        subtitle: 'उत्तम दर्जाचे बियाणे, खते आणि उपकरणे',
        search: 'उत्पादने शोधा...',
        addToCart: 'कार्टमध्ये टाका',
        buyNow: 'आत्ताच खरेदी करा',
        outOfStock: 'स्टॉकमध्ये नाही'
    }
  }
};

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    return (localStorage.getItem('kastkar_language') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('kastkar_language', language);
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
