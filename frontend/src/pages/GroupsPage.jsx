import {useState, useEffect, useContext} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import LoadingBar from "../components/LoadingBar.jsx";
import ModalEdit from "../components/ModalEdit.jsx";
import GenericTable from "../components/GenericTable.jsx";
import {ThemeContext} from "../context/ThemeContext.jsx";

const groupStudentsConfig = {
  columns: [
    { key: "id", title: "ID", width: "10%" },
    { key: "fio", title: "ФИО", width: "40%" },
    { key: "educational_id", title: "Код студента", width: "30%" },
    { key: "entrance", title: "Пропуск", width: "20%", type: "boolean" }
  ]
};

const studentsConfig = {
  columns: [
    { key: "id", title: "ID", width: "3%" },
    { key: "educational_id", title: "Код Студента", width: "11%" },
    { key: "group", title: "Группа", width: "11%" , disabled: true},
    { key: "surname", title: "Фамилия", width: "16%" },
    { key: "name", title: "Имя", width: "15%" },
    { key: "lastname", title: "Отчество", width: "15%", editable: true },
    { key: "entrance", title: "Пропуск", width: "10%", type: "boolean", inputType: "checkbox" },
    { key: "diploma", title: "Диплом", width: "10%", disabled: true },
    { key: "exams", title: "Экзамены", width: "10%", disabled: true},
  ]
};
const GroupsPage = () => {
  const { theme } = useContext(ThemeContext);
  const [groups, setGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [allStudents, setAllStudents] = useState([]);
  const [isLoading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    student_id: "",
    group_id: ""
  });
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const [currentStudentData, setCurrentStudentData] = useState({});
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [editedData, setEditedData] = useState(null);

  const handleStudentSave = async () => {
    try {
      const token = Cookies.get("access_token");
      await axios.put(
        "http://192.168.1.63:8000/api/student",
        [currentStudentData],
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await handleGroupSelect(selectedGroup.id);
      setEditModalOpen(false);
    } catch (err) {
      console.error("Ошибка сохранения:", err);
      alert("Ошибка при сохранении изменений");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("access_token");
        // Загрузка групп
        const groupsResponse = await axios.get("http://192.168.1.63:8000/api/group", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGroups(groupsResponse.data);
        const studentsResponse = await axios.get("http://192.168.1.63:8000/api/student", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAllStudents(studentsResponse.data);
      } catch (err) {
        console.error("Ошибка загрузки данных:", err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleGroupSelect = async (groupId) => {
    if (!groupId) return;
    setLoading(true);
    try {
      const token = Cookies.get("access_token");
      const response = await axios.get(`http://192.168.1.63:8000/api/group?group_id=${groupId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const groupData = response.data[0];
      // Если students_count отсутствует, вычисляем его
      // Безопасное вычисление students_count
      groupData.students_count = groupData.students?.length || 0;
      setSelectedGroup(groupData);
      setFormData(prev => ({ ...prev, group_id: groupId }));
    } catch (err) {
      console.error("Ошибка загрузки группы:", err);
      alert("Не удалось загрузить данные группы");
    } finally {
      console.log(selectedGroup.students)
      setLoading(false);
    }
  };

  const handleAddStudent = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get("access_token");
      // Преобразуем student_id и group_id в числа

      await axios.post("http://192.168.1.63:8000/api/group/add?student_id=" + formData.student_id + "&group_id=" + formData.group_id, "", {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Обновляем данные группы
      await handleGroupSelect(formData.group_id);
      setShowAddForm(false);
      setFormData({ student_id: "", group_id: formData.group_id });
    } catch (err) {
      console.error("Ошибка добавления студента:", err);
      alert("Ошибка при добавлении студента в группу");
    }
  };

  const closeModal = (e) => {
    if (e.target === e.currentTarget) {
      setShowAddForm(false);
    }
  };

  return (
    <div className="p-4">
      <LoadingBar isLoading={isLoading} />
      <div className="max-w-6xl mx-auto mt-16">
        <h1 className={`text-${theme}-text text-3xl text-center mb-6`}>Группы</h1>
        {/* Выбор группы */}
        <div className="mb-4 flex gap-4 items-center">
          <select
            onChange={(e) => handleGroupSelect(e.target.value)}
            className={`w-full p-2 bg-${theme}-field-bg text-${theme}-text rounded border border-${theme}-border duration-200`}
          >
            <option value="">Выберите группу</option>
            {groups.map((group) => (
              <option key={group.id} value={group.id}>
                {group.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowAddForm(true)}
            className={`p-2 bg-${theme}-btn-primary-bg text-${theme}-rich-text rounded hover:bg-${theme}-btn-primary-hover whitespace-nowrap duration-200`}
          >
            Добавить студента
          </button>
        </div>

        <div className={`flex gap-4 items-center text-${theme}-text w-full`}>
        {/* Модальное окно добавления */}
        {showAddForm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50000"
            onClick={closeModal}
          >
            <div className={`bg-lavender-table-bg text-lavender-rich-text p-6 rounded-lg w-96`} onClick={(e) => e.stopPropagation()}>
              <h2 className="text-xl mb-4">Добавить студента в группу</h2>
              <form onSubmit={handleAddStudent}>
                <div className="space-y-4">
                  <div>
                    <label className="text-text">Студент</label>
                    <select
                      value={formData.student_id}
                      onChange={(e) =>
                        setFormData({ ...formData, student_id: e.target.value })
                      }
                      className={`w-full p-2 bg-lavender-field-bg rounded border border-${theme}-border mt-1.5`}
                      required
                    >
                      <option value="">Выберите студента</option>
                      {allStudents.map((student) => (
                        <option key={student.id} value={student.id}>
                          {`${student.surname} ${student.name}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-text">Группа</label>
                    <select
                      value={formData.group_id}
                      onChange={(e) =>
                        setFormData({ ...formData, group_id: e.target.value })
                      }
                      className={`w-full p-2 bg-lavander-field-bg rounded border border-${theme}-border mt-1.5`}
                      required
                    >
                      {groups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex justify-end mt-6 space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="p-2 bg-btn-default-bg text-table-text rounded hover:bg-btn-default-hover"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    className="p-2 bg-dark-btn-primary-bg text-dark-btn-primary rounded hover:bg-btn-primary-hover"
                  >
                    Добавить
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {selectedGroup && (
          <div className={`w-1/3 p-4 bg-${theme}-table-bg text-${theme}-text rounded-lg shadow-md duration-200`}>
            <h2 className={`text-${theme}-rich-text text-xl font-bold mb-4`}>Информация о группе</h2>
            <p className={`mt-2`}>
              <strong>ID Группы:</strong> {selectedGroup.id}
            </p>
            <p className="mt-1">
              <strong>Название группы:</strong> {selectedGroup.name}
            </p>
            <p className="mt-1">
              <strong>Количество студентов:</strong> {selectedGroup.students_count || 0}
            </p>
            <p className="mt-1">
              <strong>Дата создания:</strong>{" "}
              {new Date(selectedGroup.created_at).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
      )}
        <div className={"w-full"}>
        {selectedGroup && (
            <GenericTable
              config={groupStudentsConfig}
              data={selectedGroup.students}
              onRowClick={(row) => {
                setEditedData(row);
                setEditModalOpen(true);
              }}
              selectedRows={selectedRows}
              onSelectedRowsChange={setSelectedRows}
            />
        )}
        </div>
        </div>

      <ModalEdit
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        columnsConfig={studentsConfig.columns}
        editedData={currentStudentData}
        setEditedData={setCurrentStudentData}
        onSave={handleStudentSave}
        isLoading={isLoading}
      />

      </div>
    </div>
  );
};

export default GroupsPage;