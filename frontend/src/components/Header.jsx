import React from "react";

const Header = () => {
  return (
    <header className="flex justify-between items-center bg-bg p-4">
      {/* Логотип слева */}
      <div className="text-accent text-2xl font-semibold">
        Фрагмент
      </div>

      {/* Центр: меню */}
      <nav className="flex space-x-6 text-text">
        <a href="#" className="hover:text-accent transition duration-200">
          Пользователи
        </a>
        <a href="#" className="hover:text-accent transition duration-200">
          Успеваемость
        </a>
        <a href="#" className="hover:text-accent transition duration-200">
          Дипломы
        </a>
        <a href="#" className="hover:text-accent transition duration-200">
          Учащиеся
        </a>
      </nav>

      {/* Аккаунт справа */}
      <div className="flex items-center space-x-2">
        <img
          src="https://www.gravatar.com/avatar?d=mp"
          alt="User Avatar"
          className="w-8 h-8 rounded-full border-2 border-accent"
        />
        <span className="text-text">Аккаунт</span>
      </div>
    </header>
  );
};

export default Header;
