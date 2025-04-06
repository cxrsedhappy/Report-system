import { useEffect } from 'react';

const ModalAdd = ({
  isOpen,
  onClose,
  newStudent,
  setNewStudent,
  onSave,
  isLoading,
  groups
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  const fieldConfig = [
    {
      label: 'Код студента',
      key: 'educational_id',
      type: 'text',
      required: true
    },
    {
      label: 'Имя',
      key: 'name',
      type: 'text',
      required: true
    },
    {
      label: 'Фамилия',
      key: 'surname',
      type: 'text',
      required: true
    },
    {
      label: 'Отчество',
      key: 'lastname',
      type: 'text'
    },
    {
      label: 'Группа',
      key: 'group_id',
      type: 'select',
      options: groups.map(g => ({ value: g.id, label: g.name }))
    },
    {
      label: 'Пропуск',
      key: 'entrance',
      type: 'select',
      options: [
        { value: "1", label: 'Есть' },
        { value: "0", label: 'Отсутствует' }
      ]
    },
    {
      label: 'Телефон',
      key: 'phone',
      type: 'tel',
      pattern: "[0-9]{11}",
      placeholder: "89261234567"
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center modal-overlay">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 modal-content">
        <form onSubmit={handleFormSubmit}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Добавить студента</h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="space-y-4">
            {fieldConfig.map(({ label, key, type, options, required, pattern, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label} {required && <span className="text-red-500">*</span>}
                </label>
                {type === 'select' ? (
                  <select
                    className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={newStudent[key] || ""}
                    onChange={e => setNewStudent({...newStudent, [key]: e.target.value})}
                    required={required}
                  >
                    <option value="">Выберите {label.toLowerCase()}</option>
                    {options?.map(({ value, label }) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type}
                    className="w-full px-3 py-2 border rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    value={newStudent[key] || ""}
                    onChange={e => setNewStudent({...newStudent, [key]: e.target.value})}
                    required={required}
                    pattern={pattern}
                    placeholder={placeholder}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Сохранение...
                </>
              ) : (
                'Добавить'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAdd;

