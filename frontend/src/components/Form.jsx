import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const Form = ({ onClose, onDataAdded, defaultData, apiEndpoint, formTitle, fieldsConfig }) => {
  const [formData, setFormData] = useState(defaultData);
  const [isVisible, setIsVisible] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // Обработчик для boolean-значений
  const handleBooleanSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setActiveDropdown(null);
  };

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center
        transition-opacity duration-300 ${isVisible ? "opacity-100" : "opacity-0"}`}
      style={{ zIndex: 9999 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
        setActiveDropdown(null);
      }}
    >
      <div
        className={`bg-table-bg p-6 rounded-lg w-96
          transition-all duration-300 transform
          ${isVisible ? "translate-y-0" : "translate-y-[-20px]"}`}
        style={{ zIndex: 10000 }}
      >
        <h2 className="text-text text-xl mb-4">{formTitle}</h2>
        <form onSubmit={async (e) => {
          e.preventDefault();
          try {
            const token = Cookies.get("access_token");
            await axios.post(apiEndpoint, formData, {
              headers: { Authorization: `Bearer ${token}` },
            });
            onDataAdded();
            handleClose();
          } catch (err) {
            alert("Ошибка при добавлении данных.");
          }
        }}>
          <div className="space-y-4">
            {fieldsConfig.map((field) => (
              <div key={field.key} className="relative">
                {field.type === "boolean" ? (
                  <div className="w-full">
                    <div
                      className="w-full p-2 bg-field-bg text-text rounded cursor-pointer border"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveDropdown(field.key);
                      }}
                    >
                      {formData[field.key] ? "Да" : "Нет"}
                    </div>

                    {activeDropdown === field.key && (
                      <div className="absolute z-50 bg-white border shadow-lg w-full">
                        <div
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleBooleanSelect(field.key, true)}
                        >
                          Да
                        </div>
                        <div
                          className="p-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleBooleanSelect(field.key, false)}
                        >
                          Нет
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <input
                    type={field.inputType || "text"}
                    value={formData[field.key] || ""}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                    className="w-full p-2 bg-field-bg text-text rounded"
                    placeholder={field.title}
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end mt-6 space-x-2">
            <button type="button" onClick={handleClose} className="p-2 bg-btn-default-bg text-table-text rounded hover:bg-btn-default-hover">
              Отмена
            </button>
            <button type="submit" className="p-2 bg-btn-primary-bg text-btn-primary rounded hover:bg-btn-primary-hover">
              Добавить
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Form;