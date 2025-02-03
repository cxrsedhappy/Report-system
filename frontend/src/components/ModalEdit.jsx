const ModalEdit = ({
  isOpen,
  onClose,
  columnsConfig,
  editedData,
  setEditedData,
  onSave,
  isLoading
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden">
        <div className="w-full md:w-3/5 p-6 overflow-y-auto">
          <h2 className="text-2xl mb-4 text-black">Редактирование записи</h2>
          {columnsConfig
            .filter(column => !column.disabled)
            .map((column) => (
              column.options ? (
                <div key={column.key} className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-black">
                    {column.title}
                  </label>
                  <select
                    value={editedData[column.key]}
                    onChange={(e) =>
                        setEditedData({...editedData, [column.key]: e.target.value})
                    }
                    className="w-full p-2 border rounded"
                    disabled={column.editable === false}
                  >
                    {Object.entries(column.options).map(([label, value]) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                        ))}
                  </select>
                </div>
                ) : (
                <div key={column.key} className="mb-4">
                  <label className="block text-sm font-medium mb-1 text-black">
                    {column.title}
                  </label>
                  <input
                    type={column.inputType || "text"}
                    value={editedData[column.key] || ""}
                    onChange={(e) =>
                      setEditedData({ ...editedData, [column.key]: e.target.value })
                    }
                    className="w-full p-2 border rounded disabled:bg-gray-200"
                    disabled={column.editable === false}
                  />
                </div>
                )
              ))}
          <div className="flex gap-2 mt-4">
            <button
                onClick={onSave}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {isLoading ? "Сохранение..." : "Изменить"}
            </button>
            <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 rounded text-black hover:bg-gray-400"
            >
              Отменить
            </button>
          </div>
        </div>

        <div className="w-full md:w-2/5 bg-gray-100 p-6 border-l text-black">
          <h3 className="text-lg font-semibold mb-4">Инструкция</h3>
          <ul className="space-y-2 text-sm">
            <li>1) Заполните необходимые поля</li>
            <li>2) Серые поля недоступны для редактирования</li>
            <li>3) Изменения сохранятся после нажатия "<span className="font-bold">Изменить</span>"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ModalEdit;