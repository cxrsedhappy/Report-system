import { useEffect } from 'react';

const ModalEdit = ({
  isOpen,
  onClose,
  editedData,
  setEditedData,
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

  if (!isOpen || !editedData) return null;

  const fieldConfig = [
    {
      key: 'educational_id',
      title: 'Код студента',
      inputType: 'text',
      required: true,
    },
    { key: 'surname', title: 'Фамилия', inputType: 'text', required: true },
    { key: 'name', title: 'Имя', inputType: 'text', required: true },
    { key: 'lastname', title: 'Отчество', inputType: 'text' },
    {
      key: 'group_id',
      title: 'Группа',
      isSelect: true,
      options: groups.map(group => ({ value: group.id, label: group.name }))
    },
    {
      key: 'entrance',
      title: 'Пропуск',
      isSelect: true,
      options: [
        { value: "1", label: 'Есть' },
        { value: "0", label: 'Отсутствует' }
      ]
    },
    { key: 'phone', title: 'Телефон', inputType: 'tel' }
  ];

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4 modal-overlay">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col modal-content">
        <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Редактирование студента
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fieldConfig.map((field) => (
              <div key={field.key} className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  {field.title} {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.isSelect ? (
                  <select
                    value={editedData[field.key] || ""}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        [field.key]: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    required={field.required}
                  >
                    {field.options.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={field.inputType || 'text'}
                    value={editedData[field.key] || ''}
                    onChange={(e) =>
                      setEditedData({
                        ...editedData,
                        [field.key]: e.target.value
                      })
                    }
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-gray-100"
                    disabled={field.editable === false}
                    required={field.required}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-end gap-3 border-t pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              Отменить
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Сохранение...
                </>
              ) : (
                'Сохранить изменения'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalEdit;

