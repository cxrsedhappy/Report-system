import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import LoadingBar from "./LoadingBar.jsx";
import AddUserForm from "./AddUserForm.jsx";

const API_URL = "http://localhost:8000/api";

const Table = () => {
  const [data, setData] = useState([]);
  const [editedData, setEditedData] = useState({});
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setLoading] = useState(false);
  const [columnWidths, setColumnWidths] = useState({});
  const [isAddUserFormOpen, setAddUserFormOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("access_token");
      const response = await axios.get(`${API_URL}/user`, {
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

  const handleUserAdded = () => {
    fetchData();
  };

  const handleEdit = (rowId, field, value) => {
    setEditedData((prev) => ({
      ...prev,
      [rowId]: { ...prev[rowId], [field]: value || null },
    }));
  };

  const handleSave = async () => {
    const updates = Object.entries(editedData).map(([id, changes]) => ({
      id: parseInt(id),
      login: changes.login || null,
      name: changes.name || null,
      surname: changes.surname || null,
      lastname: changes.lastname || null,
      privilege: changes.privilege !== undefined ? changes.privilege : null,
    }));

    setLoading(true);
    try {
      const token = Cookies.get("access_token");
      await axios.put(
        `${API_URL}/user`,
        updates,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
      await axios.delete(`${API_URL}/user`, {
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

  return (
    <div className="p-4">
      <LoadingBar isLoading={isLoading} />
      <div className="max-w-5xl mx-auto mt-16">
        <div className="flex justify-between mb-4">
          <input
              type="text"
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 bg-btn-default-bg rounded text-table-text w-1/3"
          />
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
                onClick={() => setAddUserFormOpen(true)}
                className="p-2 bg-btn-primary-bg text-btn-primary rounded hover:bg-btn-primary-hover flex items-center space-x-2"
            >
              <span>Добавить</span>
            </button>
          </div>
        </div>
        {isAddUserFormOpen && (
        <AddUserForm
          onClose={() => setAddUserFormOpen(false)}
          onUserAdded={handleUserAdded}
        />
        )}
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
              {data[0] && Object.keys(data[0]).map((key) => (
              <th key={key} style={{width: columnWidths[key] || "auto"}} className="h-6">
                {key}
              </th>
              ))}
            </tr>
          </thead>
          <tbody>
          {filteredData.map((row) => (
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
                {Object.entries(row).map(([key, value]) => (
                  <td key={key} className="">
                    <input
                      type="text"
                      value={
                        editedData[row.id]?.[key] !== undefined
                          ? editedData[row.id][key]
                          : value
                      }
                      onChange={(e) =>
                        handleEdit(row.id, key, e.target.value)
                      }
                      className={`bg-table-bg p-1 w-full text-left ${
                        editedData[row.id]?.[key] ? "bg-yellow-100" : ""
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

export default Table;