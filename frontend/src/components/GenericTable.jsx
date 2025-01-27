import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import LoadingBar from "./LoadingBar.jsx";

const GenericTable = ({ config, FormComponent, apiEndpoint, defaultFormData, pageTitle, fieldsConfig }) => {
  const [data, setData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

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

  const handleEdit = (rowId, field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [rowId]: { ...prev[rowId], [field]: value || null },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    const updates = Object.entries(editedData).map(([id, changes]) => ({
      id: parseInt(id),
      ...changes,
    }));
    try {
      const token = Cookies.get("access_token");
      await axios.put(`${apiEndpoint}`, updates, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditedData({});
      await fetchData();
    } catch (err) {
      console.error(err);
      alert("Ошибка при сохранении изменений.");
    } finally {
      setLoading(false);
    }
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

  const filteredData = data.filter((row) =>
    Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="p-4">
      <LoadingBar isLoading={isLoading} />
      <div className="max-w-5xl mx-auto mt-16">
        {/* Заголовок страницы */}
        <h1 className="text-text text-3xl text-center mb-6">{pageTitle}</h1>

        {/* Панель управления (поиск, кнопки) */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
          {/* Поле поиска */}
          <input
            type="text"
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 bg-btn-default-bg rounded text-table-text w-full sm:w-1/3"
          />

          {/* Кнопки управления */}
          <div className="flex space-x-2">
            <button
              onClick={handleSave}
              className="p-2 bg-btn-default-bg text-table-text rounded hover:bg-btn-default-hover"
            >
              Подтвердить
            </button>
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

        {/* Форма для добавления записи */}
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

        {/* Пагинация */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0">
          {/* Выбор количества записей на странице */}
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

          {/* Навигация по страницам */}
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

        {/* Таблица */}
        <table className="table-auto bg-table-bg w-full text-left text-text">
          <thead className="bg-table-hover">
            <tr>
              <th className="h-12">
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
                <th key={column.key} className="h-6">
                  {column.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentItems.map((row) => (
              <tr
                key={row.id}
                className={selectedRows.has(row.id) ? "bg-selected" : ""}
              >
                <td className="border-0">
                  <div className="w-10 flex items-center">
                    <input
                      type="checkbox"
                      className="m-auto accent-bg-hover hover:accent-pink-500"
                      checked={selectedRows.has(row.id)}
                      onChange={(e) => {
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
                  <td key={column.key} className="">
                    <input
                      type={column.inputType || "text"}
                      value={
                        editedData[row.id]?.[column.key] !== undefined
                          ? editedData[row.id][column.key]
                          : row[column.key]
                      }
                      onChange={(e) =>
                        handleEdit(row.id, column.key, e.target.value)
                      }
                      className={`bg-table-bg p-1 w-full text-left ${
                        editedData[row.id]?.[column.key] ? "bg-yellow-100" : ""
                      }`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GenericTable;