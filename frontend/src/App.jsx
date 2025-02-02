// App.jsx
import {useState, useEffect, useContext} from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header.jsx";
import Footer from "./components/Footer.jsx";
import Authorization from "./components/Authorization.jsx";
import LoadingBar from "./components/LoadingBar.jsx";

import UsersPage from "./pages/UsersPage";
import PerformancePage from "./pages/PerformancePage";
import DiplomasPage from "./pages/DiplomasPage";
import StudentsPage from "./pages/StudentsPage";
import GroupsPage from "./pages/GroupsPage.jsx";
import AddSubjectPage from "./pages/AddSubjectPage";

import {ThemeContext, ThemeProvider} from "./context/ThemeContext";

import Cookies from "js-cookie";

const validateToken = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp && payload.exp > currentTime;
  } catch {
    return false;
  }
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const { theme } = useContext(ThemeContext);

  useEffect(() => {
    const token = Cookies.get("access_token");
    if (token) {
      if (validateToken(token)) {
        setIsAuthenticated(true);
      } else {
        Cookies.remove("access_token");
        setIsAuthenticated(false);
      }
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
      <div className={`flex flex-col min-h-screen bg-${theme}-bg duration-200`}>
        {/* Загрузочная полоса */}
        <LoadingBar isLoading={isLoading} />

        {/* Заголовок */}
        {isAuthenticated && <Header />}

        {/* Основной контент */}
        <div className="flex-grow">
          {isAuthenticated ? (
            <Routes>
              <Route path="/groups" element={<GroupsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route path="/performance" element={<PerformancePage />} />
              <Route path="/diplomas" element={<DiplomasPage />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/add-subject" element={<AddSubjectPage />} />
              <Route path="*" element={<Navigate to="/users" />} />
            </Routes>
          ) : (
            <div className="flex items-center justify-center h-full">
              <Authorization onLogin={handleLogin} setLoading={setLoading} />
            </div>
          )}
        </div>

        {/* Футер */}
        <Footer />
      </div>
  );
};

export default App;