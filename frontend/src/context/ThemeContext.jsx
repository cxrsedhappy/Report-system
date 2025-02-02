import { createContext, useState, useEffect } from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark"); // По умолчанию темная тема

  const toggleTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("selectedTheme", newTheme); // Сохраняем тему
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("selectedTheme");
    if (savedTheme) {
      setTheme(savedTheme); // Загружаем сохраненную тему
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};