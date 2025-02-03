// components/Header.jsx
import {useContext, useEffect, useState} from "react";
import { Link, useLocation } from "react-router-dom"; // Импортируем useLocation
import Cookies from "js-cookie";
import ThemeSwitcher from "./ThemeSwitcher.jsx";
import {ThemeContext} from "../context/ThemeContext.jsx";

const Header = () => {
  const [login, setLogin] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation(); // Получаем текущий маршрут
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      try {
        const decodedToken = atob(token.split(".")[1]); // Decode JWT payload
        const user = JSON.parse(decodedToken);
        setLogin(user.login);
      } catch {
        setLogin(null);
      }
    }
  }, []);

  // Закрываем dropdown при изменении маршрута
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location.pathname]);

  // Функция для закрытия dropdown при клике вне его области
  useEffect(() => {
    const handleClickOutside = (event) => {
      const accountDropdown = document.getElementById("account-dropdown");
      if (accountDropdown && !accountDropdown.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };


    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    Cookies.remove("access_token");
    window.location.reload();
  };

  return (
    <header className={`flex bg-${theme}-table-bg justify-between items-center p-4`}>
      {/* Logo */}
      <div className={`text-2xl font-semibold`}>
        <a className={`text-${theme}-accent`}>Фрагмент</a>
      </div>

      {/* Menu */}
      <nav className={`flex text-${theme}-text space-x-6`}>
        <Link to="/users" className={`hover:text-${theme}-accent transition`}>
          Пользователи
        </Link>
        <Link to="/performance" className={`hover:text-${theme}-accent transition`}>
          Успеваемость
        </Link>
        <Link to="/diplomas" className={`hover:text-${theme}-accent transition`}>
          Дипломы
        </Link>
        <Link to="/students" className={`hover:text-${theme}-accent transition`}>
          Учащиеся
        </Link>
        <Link to="/groups" className={`hover:text-${theme}-accent transition`}>
          Группы
        </Link>
        <ThemeSwitcher />
      </nav>

      {/* Account Dropdown */}
      <div className="relative" id="account-dropdown">
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <img
            src="https://www.gravatar.com/avatar?d=mp"
            alt="User Avatar"
            className={`w-8 h-8 rounded-full border-2 bg-${theme}-btn-primary-bg`}
          />
          <span className={`text-${theme}-text`}>{login ? login : "Аккаунт"}</span>
        </div>
        {isDropdownOpen && (
          <div className={`absolute right-0 mt-2 w-48 bg-${theme}-dropdown-bg rounded shadow-lg z-10`}>
            <Link
              to="/add-subject"
              className={`block px-4 py-2 text-${theme}-text hover:bg-${theme}-dropdown-hover transition duration-200`}
            >
              Добавить предмет
            </Link>
            <button
              onClick={handleLogout}
              className={`block w-full text-left px-4 py-2 text-${theme}-text hover:bg-${theme}-dropdown-hover transition duration-200`}
            >
              Выйти
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;