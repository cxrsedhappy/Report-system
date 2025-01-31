import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import LoadingBar from "./LoadingBar.jsx";

const GenericTable = ({
  config,
  FormComponent,
  apiEndpoint,
  defaultFormData,
  pageTitle,
  fieldsConfig
}) => {
  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedRow, setSelectedRow] = useState(null);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editedData, setEditedData] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("access_token");
      const response = await axios.get(`${apiEndpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDataAdded = () => {
    fetchData();
  };

  const handleDelete = async () => {
    const idsToDelete = Array.from(selectedRows);
    setLoading(true);
    try {
      const token = Cookies.get("access_token");
      await axios.delete(`${apiEndpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: idsToDelete,
      });
      setData(data.filter((row) => !selectedRows.has(row.id)));
      await fetchData();
      setSelectedRows(new Set());
    } catch (err) {
      console.error(err);
      alert("Ошибка при удалении записей.");
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (row) => {
    setSelectedRow(row);
    setEditedData(row);
    setModalOpen(true);
  };

  const handleModalSave = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("access_token");
      await axios.put(`${apiEndpoint}`, [{
        id: selectedRow.id,
        ...editedData
      }], {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      await fetchData();
      setModalOpen(false);
    } catch (err) {
      console.error(err);
      alert("Ошибка при сохранении изменений.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="p-4">
      <LoadingBar isLoading={isLoading} />
      <div className="max-w-6xl mx-auto mt-16">
        <h1 className="text-text text-3xl text-center mb-6">{pageTitle}</h1>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
          <input
            type="text"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 bg-btn-default-bg rounded text-table-text w-full sm:w-1/3"
          />

          <div className="flex space-x-2">
            <button
              onClick={handleDelete}
              className="p-2 bg-btn-default-bg text-table-text rounded hover:bg-btn-default-hover"
            >
              Удалить
            </button>
            <button
              onClick={() => setFormOpen(true)}
              className="p-2 bg-btn-primary-bg text-btn-primary rounded hover:bg-btn-primary-hover"
            >
              Добавить
            </button>
          </div>
        </div>

        {isFormOpen && (
          <FormComponent
            onClose={() => setFormOpen(false)}
            onDataAdded={handleDataAdded}
            defaultData={defaultFormData}
            apiEndpoint={apiEndpoint}
            formTitle={pageTitle}
            fieldsConfig={fieldsConfig}
          />
        )}

        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
          <div className="flex items-center">
            <label className="text-table-text">
              Записей на странице:
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="ml-2 p-1 bg-btn-default-bg rounded"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
                <option value={20}>20</option>
              </select>
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 bg-btn-default-bg text-table-text rounded hover:bg-btn-default-hover"
            >
              Назад
            </button>
            <span className="text-table-text">
              Страница {currentPage} из {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 bg-btn-default-bg text-table-text rounded hover:bg-btn-default-hover"
            >
              Вперед
            </button>
          </div>
        </div>

        <table className="table-auto bg-table-bg w-full text-left text-text">
          <thead className="bg-table-hover">
            <tr>
              <th className="h-12" style={{ width: "10px" }}>
                <div className="w-10 flex items-center">
                  <input
                    className="m-auto"
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedRows(
                        e.target.checked
                          ? new Set(data.map((row) => row.id))
                          : new Set()
                      )
                    }
                    checked={selectedRows.size === data.length}
                  />
                </div>
              </th>
              {config.columns.map((column) => (
                <th
                  key={column.key}
                  className="h-6"
                  style={{ width: column.width }}
                >
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row) => (
              <tr
                key={row.id}
                className={`cursor-pointer ${
                  selectedRows.has(row.id) ? "bg-selected" : ""
                }`}
                onClick={() => handleRowClick(row)}
              >
                <td className="border-0" style={{ width: "50px" }}>
                  <div className="w-10 flex items-center">
                    <input
                      type="checkbox"
                      className="m-auto accent-bg-hover hover:accent-pink-500"
                      checked={selectedRows.has(row.id)}
                      onChange={(e) => {
                        e.stopPropagation();
                        const newSet = new Set(selectedRows);
                        if (e.target.checked) {
                          newSet.add(row.id);
                        } else {
                          newSet.delete(row.id);
                        }
                        setSelectedRows(newSet);
                      }}
                    />
                  </div>
                </td>
                {config.columns.map((column) => (
                  <td
                    key={column.key}
                    className="p-2"
                    style={{ width: column.width }}
                  >
                    {column.type === "boolean"
                      ? row[column.key]
                        ? "Да"
                        : "Нет"
                      : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col md:flex-row overflow-hidden">
              <div className="w-full md:w-3/5 p-6 overflow-y-auto">
                <h2 className="text-2xl mb-4">Редактирование записи</h2>
                {config.columns.map((column) => (
                  !column.disabled && (
                    <div key={column.key} className="mb-4">
                      <label className="block text-sm font-medium mb-1">
                        {column.title}
                      </label>
                      {column.type === "boolean" ? (
                        <select
                          value={editedData[column.key]}
                          onChange={(e) => setEditedData(prev => ({
                            ...prev,
                            [column.key]: e.target.value === "true"
                          }))}
                          className="w-full p-2 border rounded"
                        >
                          <option value="true">Да</option>
                          <option value="false">Нет</option>
                        </select>
                      ) : (
                        <input
                          type="text"
                          value={editedData[column.key] || ""}
                          onChange={(e) => setEditedData(prev => ({
                            ...prev,
                            [column.key]: e.target.value
                          }))}
                          className="w-full p-2 border rounded"
                        />
                      )}
                    </div>
                  )
                ))}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleModalSave}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Изменить
                  </button>
                  <button
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    Отменить
                  </button>
                </div>
              </div>

              <div className="w-full md:w-2/5 bg-gray-100 p-6 border-l">
                <h3 className="text-lg font-semibold mb-4">Инструкция</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Заполните необходимые поля</li>
                  <li>• Для логических значений используйте выпадающий список</li>
                  <li>• Серые поля недоступны для редактирования</li>
                  <li>• Изменения сохранятся после нажатия "Изменить"</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenericTable;