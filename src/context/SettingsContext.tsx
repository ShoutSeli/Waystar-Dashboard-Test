import { createContext, useContext, useEffect, useState } from "react";

type SettingsType = {
  theme: "light" | "dark";
  language: "en" | "fr";
  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (lang: "en" | "fr") => void;
};

const SettingsContext = createContext<SettingsType | null>(null);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<"light" | "dark">("light");
  const [language, setLanguageState] = useState<"en" | "fr">("en");

  // Load saved settings
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark";
    const savedLang = localStorage.getItem("language") as "en" | "fr";

    if (savedTheme) setThemeState(savedTheme);
    if (savedLang) setLanguageState(savedLang);
  }, []);

  // Apply theme globally
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const setTheme = (theme: "light" | "dark") => {
    setThemeState(theme);
  };

  const setLanguage = (lang: "en" | "fr") => {
    setLanguageState(lang);
  };

  return (
    <SettingsContext.Provider value={{ theme, language, setTheme, setLanguage }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error("useSettings must be used within SettingsProvider");
  return context;
};