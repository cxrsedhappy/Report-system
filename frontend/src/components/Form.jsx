import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Form = ({ onClose, onDataAdded, defaultData, apiEndpoint, formTitle, fieldsConfig }) => {
  const [formData, setFormData] = useState(defaultData);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const validateForm = () => {
    return fieldsConfig.every(field => {
      if (!field.required) return true;
      const value = formData[field.key];
      return value !== undefined && value !== null && value !== '';
    });
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      alert("Заполните обязательные поля");
      return;
    }
    try {
      const token = Cookies.get("access_token");

      // Преобразуем privilege в число
      const formDataWithNumberPrivilege = {
        ...formData,
        privilege: parseInt(formData.privilege, 10)
      };

      await axios.post(apiEndpoint, formDataWithNumberPrivilege, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDataAdded();
      handleClose();
    } catch (err) {
      alert("Ошибка при добавлении данных.");
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center
        transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      style={{ zIndex: 9999 }}
    >
      <div
        className={`bg-white p-6 rounded-lg w-96
          transition-all duration-300 transform
          ${isVisible ? "translate-y-0" : "translate-y-[-20px]"}`}
        style={{ zIndex: 10000 }}
      >
        <h2 className="text-2xl mb-4 text-black">{formTitle}</h2>
        <form onSubmit={handleAdd}>
          <div className="space-y-4">
            {fieldsConfig
            .filter(field => field.editable !== false)
            .map((field) => (
              field.options ? (
                // Если у поля есть options, отображаем выпадающий список
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-1 text-black">{field.title}</label>
                  <select
                    value={formData[field.key]}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="w-full p-2 border rounded"
                    required={field.required}
                  >
                    {Object.entries(field.options).map(([label, value]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                // Иначе отображаем обычное текстовое поле
                <div key={field.key} className="relative">
                  <label className="block text-sm font-medium mb-1 text-black">{field.title}</label>
                  <input
                    type={field.inputType || "text"}
                    value={formData[field.key] || ""}
                    onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                    className="w-full p-2 border rounded disabled:bg-gray-200"
                    placeholder={field.title}
                    required={field.required}
                    disabled={field.editable === false}
                  />
                </div>
              )
            ))}
          </div>
          <div className="flex justify-end mt-6 space-x-2">
            <button type="button" onClick={handleClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Отмена
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;