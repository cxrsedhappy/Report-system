import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = "http://localhost:8000/api";

const AddUserForm = ({ onClose, onUserAdded }) => {
  const [formData, setFormData] = useState({
    login: "",
    password: "",
    name: "",
    surname: "",
    lastname: "",
    privilege: 0,
  });
  const [isVisible, setIsVisible] = useState(false);

  // Анимация при открытии
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Анимация при закрытии
  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("access_token");
      await axios.post(`${API_URL}/user`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      onUserAdded();
      handleClose(); // Используем анимированное закрытие
    } catch (err) {
      console.error(err);
      alert("Ошибка при добавлении пользователя.");
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center
        transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      onClick={(e) => e.target === e.currentTarget && handleClose()}
    >
      <div
        className={`bg-table-bg p-6 rounded-lg w-96
          transition-all duration-300 transform
          ${isVisible ? "translate-y-0" : "translate-y-[-20px]"}`
        }
      >
        <h2 className="text-text text-xl mb-4">Добавить пользователя</h2>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
                  type="text"
                  name="login"
                  placeholder="Логин"
                  value={formData.login}
                  onChange={handleChange}
                  className="w-full p-2 bg-field-bg text-text rounded"
                  required
              />
              <input
                  type="password"
                  name="password"
                  placeholder="Пароль"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-2 bg-field-bg text-text rounded"
                  required
              />
              <input
                  type="text"
                  name="name"
                  placeholder="Имя"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-2 bg-field-bg text-text rounded"
              />
              <input
                  type="text"
                  name="surname"
                  placeholder="Фамилия"
                  value={formData.surname}
                  onChange={handleChange}
                  className="w-full p-2 bg-field-bg text-text rounded"
              />
              <input
                  type="text"
                  name="lastname"
                  placeholder="Отчество"
                  value={formData.lastname}
                  onChange={handleChange}
                  className="w-full p-2 bg-field-bg text-text rounded"
              />
              <input
                  type="number"
                  name="privilege"
                  placeholder="Привилегия"
                  value={formData.privilege}
                  onChange={handleChange}
                  className="w-full p-2 bg-field-bg text-text rounded"
              />
          </div>
          <div className="flex justify-end mt-6 space-x-2">
            <button
              type="button"
              onClick={handleClose}
              className="p-2 bg-btn-default-bg text-table-text rounded hover:bg-btn-default-hover"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="p-2 bg-btn-primary-bg text-btn-primary rounded hover:bg-btn-primary-hover"
            >
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;