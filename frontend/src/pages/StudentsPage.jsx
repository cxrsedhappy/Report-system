// StudentsTable.jsx
import GenericTable from "../components/GenericTable";
import Form from "../components/Form.jsx";
import LoadingBar from "../components/LoadingBar.jsx";
import ModalEdit from "../components/ModalEdit.jsx";
import {useContext, useEffect, useState} from "react";
import {ThemeContext} from "../context/ThemeContext.jsx";
import Cookies from "js-cookie";
import axios from "axios";

const apiEndpoint = "http://192.168.1.63:8000/api/student";
const pageTitle = "Студенты";

const fieldsConfig = [
    { key: "id", title: "ID", width: "3%", editable: false },
    { key: "educational_id", title: "Код Студента", width: "11%", editable: true },
    { key: "group", title: "Группа", width: "11%" , editable: false},
    { key: "surname", title: "Фамилия", width: "16%", editable: true },
    { key: "name", title: "Имя", width: "15%", editable: true },
    { key: "lastname", title: "Отчество", width: "15%", editable: true },
    { key: "entrance", title: "Пропуск", width: "10%", editable: true, boolean: true, type: "options", options: {"Да": 1, "Нет": 0} },
    { key: "diploma", title: "Диплом", width: "10%", editable: false},
    { key: "exams", title: "Экзамены", width: "10%", editable: false},
  ];


const formConfig = [
  { key: "educational_id", title: "Код Студента"},
  { key: "surname", title: "Фамилия" },
  { key: "name", title: "Имя" },
  { key: "lastname", title: "Отчество" },
  { key: "entrance", title: "Пропуск", type: "boolean", options: {"Да": 1, "Нет": 0}},
];

const StudentsPage = () => {
  const { theme } = useContext(ThemeContext);

  const [data, setData] = useState([]);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [isLoading, setLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [editedData, setEditedData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredData = data.filter(row =>
    Object.values(row).some(value =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = Cookies.get("access_token");
      const response = await axios.get(apiEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке данных:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async () => {
    if (selectedRows.size === 0) return;
    if (!confirm("Вы уверены, что хотите удалить выбранные записи?")) return;

    setLoading(true);
    try {
      const token = Cookies.get("access_token");
      await axios.delete(apiEndpoint, {
        headers: { Authorization: `Bearer ${token}` },
        data: Array.from(selectedRows)
      });

      setData(prev => prev.filter(item => !selectedRows.has(item.id)));
      setSelectedRows(new Set());
    } catch (error) {
      console.error("Ошибка при удалении:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
  if (!editedData) return;
  setLoading(true);

  try {
    const token = Cookies.get("access_token");

    // Находим оригинальную запись
    const originalData = data.find(item => item.id === editedData.id);

    // Формируем объект с измененными данными
    const changedData = Object.keys(editedData).reduce((acc, key) => {
      if (editedData[key] !== originalData[key]) {
        acc[key] = editedData[key];
      }
      return acc;
    }, { id: editedData.id });

    // Если есть изменения, отправляем их
    if (Object.keys(changedData).length > 1) { // Проверяем, что есть изменения помимо 'id'
      await axios.put(
        apiEndpoint,
        [changedData], // Оборачиваем данные в массив
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setData(prev =>
        prev.map(item => item.id === editedData.id ? { ...item, ...changedData } : item)
      );
    }

    setModalOpen(false);
  } catch (error) {
    console.error("Ошибка при сохранении:", error);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className={`text-${theme}-text p-4`}>
      <LoadingBar isLoading={isLoading} />
      <div className={"max-w-6xl mx-auto mt-16"}>
        <h1 className={"text-3xl text-center mb-6"}>{pageTitle}</h1>

        <div className={"flex flex-col sm:flex-row justify-between items-center mb-4 space-y-4 sm:space-y-0"}>
          <input
              type="text"
              placeholder="Поиск..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full sm:w-1/3 p-2 border rounded bg-${theme}-btn-default-bg text-${theme}-table-text border-${theme}-border duration-200`}
          />

          <div className={"flex space-x-2"}>
            <button
                className={`px-4 py-2 rounded bg-${theme}-btn-default-bg hover:bg-${theme}-btn-default-hover duration-200`}
                onClick={handleDelete}
            >
              Удалить
            </button>
            <button
                className={`px-4 py-2 rounded bg-${theme}-btn-primary-bg text-${theme}-rich-text hover:bg-${theme}-btn-default-hover duration-200`}
                onClick={() => setFormOpen(true)}
            >
              Добавить
            </button>
          </div>
        </div>

        <GenericTable
            config={{
              columns: fieldsConfig.map(f => ({
                key: f.key,
                title: f.title,
                type: f.type,
                options: f.options,
                width: f.width
              }))
            }}
            data={currentItems}
            onRowClick={(row) => {
              setEditedData(row);
              setModalOpen(true);
            }}
            selectedRows={selectedRows}
            onSelectedRowsChange={setSelectedRows}
        />

        <div className={"flex justify-between items-center mt-4"}>
          <select
              value={itemsPerPage}
              onChange={e => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className={`p-2 bg-${theme}-btn-default-bg rounded text-table-text duration-200`}
          >
            {[5, 10, 15, 20].map(value => (
                <option key={value} value={value}>{value}</option>
            ))}
          </select>

          <div className={`flex gap-2`}>
            <button
                className={`px-4 py-2 rounded bg-${theme}-btn-default-hover hover:bg-${theme}-btn-default-hover duration-200`}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
            >
              Назад
            </button>

            <span className={"py-2"}>
              Страница {currentPage} из {Math.ceil(filteredData.length / itemsPerPage)}
            </span>

            <button
                className={`px-4 py-2 rounded bg-${theme}-btn-default-hover hover:bg-${theme}-btn-default-hover duration-200`}
                onClick={() => setCurrentPage(p =>
                    Math.min(p + 1, Math.ceil(filteredData.length / itemsPerPage))
                )}
                disabled={currentPage >= Math.ceil(filteredData.length / itemsPerPage)}
            >
              Вперед
            </button>
          </div>
        </div>

        {isFormOpen && (
            <Form
                apiEndpoint={apiEndpoint}
                formTitle="Добавить студента"
                fieldsConfig={formConfig}
                defaultData={{privilege: false}}
                onClose={() => setFormOpen(false)}
                onDataAdded={fetchData}
            />
        )}

        <ModalEdit
            isOpen={isModalOpen}
            onClose={() => setModalOpen(false)}
            columnsConfig={fieldsConfig}
            editedData={editedData}
            setEditedData={setEditedData}
            onSave={handleSave}
            isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default StudentsPage;