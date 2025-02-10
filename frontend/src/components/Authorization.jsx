import {useContext, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import {ThemeContext} from "../context/ThemeContext.jsx";

const API_URL = 'http://192.168.1.63:8000/api'

const Authorization = ({ onLogin, setLoading }) => {
  const { theme } = useContext(ThemeContext);

  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/oauth2/authorize`, {
        login,
        password,
      });
      Cookies.set("access_token", response.data["access_token"], { path: "/" });
      setError(null);
      onLogin();
    } catch (err) {
      setError("Invalid login or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`p-4 bg-${theme}-bg rounded shadow-md w-full max-w-md mt-72`}>
      <h2 className={`text-lg text-${theme}-text font-semibold text-${theme}-field mb-4`}>Authorization</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="text"
          placeholder="Login"
          className={`w-full p-2 bg-${theme}-field-bg text-${theme}-text placeholder-field-placeholder rounded`}
          value={login}
          onChange={(e) => setLogin(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className={`w-full p-2 bg-${theme}-field-bg text-${theme}-text placeholder-field-placeholder rounded`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          className={`w-full bg-${theme}-btn-primary-bg text-${theme}-btn-primary hover:bg-btn-primary-hover transition duration-DEFAULT p-2 rounded`}
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Authorization;