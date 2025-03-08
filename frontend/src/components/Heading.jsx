import { useEffect, useState } from "react";
import { Link, useLocation} from "react-router-dom";
import Cookies from "js-cookie";

function Heading() {
  const location = useLocation();

  const [login, setLogin] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      try {
        const decodedToken = atob(token.split(".")[1]);
        const user = JSON.parse(decodedToken);
        setLogin(user.login);
      } catch {
        setLogin(null);
      }
    }
  }, []);

  const handleLogout = () => {
    Cookies.remove("access_token");
    window.location.reload();
  };

  const dropdownStyles = {
    transition: 'all 0.2s ease-in-out',
    transformOrigin: 'top',
  };

  return (
    <header className="fixed w-full z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">

          <div className="flex items-center">
            <a href="#" className="text-2xl font-bold text-indigo-600">
              <span className="tracking-wide">Фрагмент</span>
            </a>
          </div>

          <nav className="hidden md:flex items-center space-x-1">

            {[{"students": "Студенты"}, {"users": "Пользователи"}, {"performance": "Успеваемость"}, {"diplomas": "Дипломы"}, {"groups": "Группы"}].map(
              (item, index) => {
                const key = Object.keys(item)[0];
                const value = Object.values(item)[0];
                return (
                  <Link
                    key={index}
                    to={`/${Object.keys(item)[0]}`}
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      location.pathname === `/${key}` ? "text-white bg-indigo-600 hover:bg-indigo-700" : "text-gray-700 hover:bg-gray-100"
                    } transition-colors`}
                  >
                    {value}
                  </Link>
                );
              }
            )}

          </nav>

          <div className="flex items-center">
            <div className="relative ml-3">
              <div>
                <button
                  type="button"
                  className="flex items-center space-x-3 focus:outline-none"
                  id="user-menu-button"
                  aria-expanded="false"
                  aria-haspopup="true"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center">
                      <span className="text-indigo-600 font-semibold text-sm">ИП</span>
                    </div>
                    <span className="ml-2 text-sm font-medium text-gray-700">{login}</span>
                    <svg className="ml-1 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                         fill="currentColor">
                      <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                    </svg>
                  </div>
                </button>
              </div>

              {isDropdownOpen && (
                  <div
                      className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                      role="menu"
                      aria-orientation="vertical"
                      aria-labelledby="user-menu-button"
                      style={{
                        ...dropdownStyles,
                        animation: `${isDropdownOpen ? 'slideDown' : 'slideUp'} 0.2s ease-in-out`,
                      }}
                  >
                    <Link to={"/add-subject"} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <i className="fas fa-plus mr-2 text-indigo-500"></i>Добавить предмет
                    </Link>
                    <a className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={handleLogout}>
                      <i className="fas fa-sign-out-alt mr-2 text-indigo-500"></i>Выйти
                    </a>
                  </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </header>
  );
}

export default Heading;