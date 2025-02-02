import { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="flex space-x-4">
      <button
        onClick={() => toggleTheme("dark")}
        className={theme === "dark" ? "bg-gray-500 text-white" : "bg-gray-300"}
      >
        Темная тема
      </button>
      <button
        onClick={() => toggleTheme("lavender")}
        className={theme === "lavender" ? "bg-gray-500 text-white" : "bg-gray-300"}
      >
        Лавандовая тема
      </button>
    </div>
  );
};

export default ThemeSwitcher;