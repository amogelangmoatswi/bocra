"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "tn";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    home: "Home",
    about: "About",
    services: "Services",
    licensing: "Licensing",
    complaints: "Complaints",
    dashboard: "Dashboard",
    consultations: "Consultations",
    contact: "Contact",
    apply: "Apply for Licence",
    search_placeholder: "Search BOCRA...",
    tagline: "A Connected and Digitally Driven Society",
    hero_title: "Empowering Botswana's Communication Future",
    cta_licensing: "Visit Licensing Portal",
    chatbot_welcome: "Hello! I'm the BOCRA Virtual Assistant. How can I help you today?",
  },
  tn: {
    home: "Legae",
    about: "Ka BOCRA",
    services: "Ditirelo",
    licensing: "Dilaesense",
    complaints: "Dingongorego",
    dashboard: "Dipalopalo",
    consultations: "Therisano",
    contact: "Ikane",
    apply: "Kopa Laesense",
    search_placeholder: "Batla mo BOCRA...",
    tagline: "Setshaba se se Golaganeng ka Dijidatale",
    hero_title: "Go Nonotsha Bokamoso jwa Tlhaeletsanyo mo Botswana",
    cta_licensing: "Etela Mafelo a Dilaesense",
    chatbot_welcome: "Dumela! Ke Mothusi wa BOCRA wa Serala. Nka go thusa jang gompieno?",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
