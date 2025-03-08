import {useCallback, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import PropTypes from "prop-types";

const API_URL = 'http://192.168.1.63:8000/api'

function Authorization({ onLogin, setLoading }) {
  const [credentials, setCredentials] = useState({ login: '', password: '' });
  const [error, setError] = useState(null);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(`${API_URL}/oauth2/authorize`, credentials);
      Cookies.set("access_token", data["access_token"], { path: "/"});
      onLogin();
    } catch (err) {
      setError(err.response?.data?.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }, [credentials, onLogin, setLoading]);

  const handleInputChange = useCallback((field) => (e) => {
    setCredentials(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <div className={`bg-bg rounded-lg shadow-xl w-full max-w-md p-6`}>
                <h1 className={`text-text text-2xl font-bold mb-6 text-center`}>Доступ к системе</h1>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <input
                        aria-label="Login"
                        type="text"
                        placeholder="Логин"
                        className={`w-full px-4 py-3 rounded-lg bg-field-bg text-text focus:ring-2 focus:ring-accent outline-none transition-all`}
                        value={credentials.login}
                        onChange={handleInputChange('login')}
                    />
                    <input
                        aria-label="Login"
                        type="text"
                        placeholder="Пароль"
                        className={`w-full px-4 py-3 rounded-lg bg-field-bg text-text focus:ring-2 focus:ring-accent outline-none transition-all`}
                        value={credentials.password}
                        onChange={handleInputChange('password')}
                    />
                    {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

                    <button
                        type="submit"
                        className={`w-full py-3 px-4 rounded-lg bg-btn-primary-bg text-text hover:bg-btn-primary-hover transition-colors font-bold`}
                    >
                        Войти
                    </button>
                </form>
            </div>
        </div>
    );
}

Authorization.propTypes = {
  onLogin: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired
};

export default Authorization;