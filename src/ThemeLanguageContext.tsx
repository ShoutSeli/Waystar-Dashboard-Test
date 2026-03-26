import React, { createContext, useContext, useState, useEffect } from "react";

interface ThemeLanguageContextType {
  darkMode: boolean;
  setDarkMode: (value: boolean) => void;
  language: string;
  setLanguage: (value: string) => void;
}

const ThemeLanguageContext = createContext<ThemeLanguageContextType | undefined>(undefined);

export const ThemeLanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [darkMode, setDarkModeState] = useState(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? JSON.parse(saved) : false;
  });

  const [language, setLanguageState] = useState(() => {
    const saved = localStorage.getItem("language");
    return saved || "English";
  });

  const setDarkMode = (value: boolean) => {
    setDarkModeState(value);
    localStorage.setItem("darkMode", JSON.stringify(value));
    if (value) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const setLanguage = (value: string) => {
    setLanguageState(value);
    localStorage.setItem("language", value);
  };

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  useEffect(() => {
    const saved = localStorage.getItem("darkMode");
    if (saved && JSON.parse(saved)) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <ThemeLanguageContext.Provider value={{ darkMode, setDarkMode, language, setLanguage }}>
      {children}
    </ThemeLanguageContext.Provider>
  );
};

export const useThemeLanguage = () => {
  const context = useContext(ThemeLanguageContext);
  if (context === undefined) {
    throw new Error("useThemeLanguage must be used within ThemeLanguageProvider");
  }
  return context;
};
