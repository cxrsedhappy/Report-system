import {useState, useEffect, useContext} from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import {ThemeContext} from "./context/ThemeContext";
import Cookies from "js-cookie";

import Authorization from "./components/Authorization.jsx"
import Heading from "./components/Heading.jsx";
import Footer from "./components/Footer.jsx";
import LoadingBar from "./components/LoadingBar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import UsersPage from "./pages/UsersPage";
import PerformancePage from "./pages/PerformancePage";
import DiplomasPage from "./pages/DiplomasPage";
import StudentsPage from "./pages/StudentsPage";
import GroupsPage from "./pages/GroupsPage.jsx";
import AddSubjectPage from "./pages/AddSubjectPage";

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
      <LoadingBar isLoading={isLoading} />

      {isAuthenticated && <Heading />}

      <div className="flex-grow duration-200">
        {isAuthenticated ? (
          <Routes>
            <Route path="/groups" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <GroupsPage />
              </ProtectedRoute>
            }/>
            <Route path="/users" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <UsersPage />
              </ProtectedRoute>
            }/>
            <Route path="/performance" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <PerformancePage />
              </ProtectedRoute>
            }/>
            <Route path="/diplomas" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <DiplomasPage />
              </ProtectedRoute>
            }/>
            <Route path="/students" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <StudentsPage />
              </ProtectedRoute>
            }/>
            <Route path="/add-subject" element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <AddSubjectPage />
              </ProtectedRoute>
            }/>
            <Route path="*" element={<Navigate to="/users" />} />
          </Routes>
        ) : (
          <div className="flex items-center justify-center h-full p-4">
            <Authorization onLogin={handleLogin} setLoading={setLoading}/>
          </div>
        )}
      </div>

      <Footer className={`bg-${theme}-footer-bg`} />
    </div>
  );
};

export default App;