import { createContext, useContext, useEffect, useState } from "react";

type SettingsType = {
  theme: "light" | "dark";
  language: "en" | "fr";
  setTheme: (theme: "light" | "dark") => void;
  setLanguage: (lang: "en" | "fr") => void;
};

const SettingsContext = createContext<SettingsType | null>(null);

export const SettingsProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<"light" | "dark">(() => {
    // Initialise from localStorage immediately so there's no flash
    return (localStorage.getItem("theme") as "light" | "dark") ?? "light";
  });

  const [language, setLanguageState] = useState<"en" | "fr">(() => {
    return (localStorage.getItem("language") as "en" | "fr") ?? "en";
  });

  // Apply dark class to <html> whenever theme changes
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Persist language preference
  useEffect(() => {
    localStorage.setItem("language", language);
    // Set the html lang attribute so screen readers & browser translate pick it up
    document.documentElement.setAttribute("lang", language);
  }, [language]);

  const setTheme = (t: "light" | "dark") => setThemeState(t);
  const setLanguage = (l: "en" | "fr") => setLanguageState(l);

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