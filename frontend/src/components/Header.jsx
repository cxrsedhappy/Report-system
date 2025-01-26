import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const Header = () => {
  const [login, setLogin] = useState(null);

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

  return (
    <header className="flex justify-between items-center bg-table-bg p-4">
      {/* Logo */}
      <div className="text-accent text-2xl font-semibold"><a>Фрагмент</a></div>

      {/* Menu */}
        <nav className="flex space-x-6 text-text">
            <Link to="/users" className="hover:text-accent transition duration-200">
                Пользователи
            </Link>
            <Link to="/performance" className="hover:text-accent transition duration-200">
                Успеваемость
            </Link>
            <Link to="/diplomas" className="hover:text-accent transition duration-200">
                Дипломы
            </Link>
            <Link to="/students" className="hover:text-accent transition duration-200">
                Учащиеся
            </Link>
        </nav>

        {/* Account */}
        <div className="flex items-center space-x-2">
            <img
                src="https://www.gravatar.com/avatar?d=mp"
                alt="User Avatar"
                className="w-8 h-8 rounded-full border-2 border-accent"
            />
            <span className="text-text">{login ? login : "Аккаунт"}</span>
        </div>
    </header>
  );
};

export default Header;