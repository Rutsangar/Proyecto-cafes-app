import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  isDark: boolean;
  setIsDark: (isDark: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Intentamos recuperar la preferencia del usuario del almacenamiento local
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? JSON.parse(saved) : false;
  });

  // ESTA ES LA FUNCIÓN QUE CAMBIA TODO
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add('dark'); // Añade la clase .dark al <html>
    } else {
      root.classList.remove('dark'); // Quita la clase .dark
    }
    localStorage.setItem('theme', JSON.stringify(isDark));
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme debe usarse dentro de un ThemeProvider');
  return context;
};