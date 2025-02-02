import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import LoadingBar from "../components/LoadingBar.jsx";
import ModalEdit from "../components/ModalEdit.jsx";
import GenericTable from "../components/GenericTable.jsx";

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
    { key: "lastname", title: "Отчество", width: "15%" },
    { key: "entrance", title: "Пропуск", width: "10%", type: "boolean", inputType: "checkbox" },
    { key: "diploma", title: "Диплом", width: "10%", disabled: true },
    { key: "exams", title: "Экзамены", width: "10%", disabled: true},
  ]
};
const GroupsPage = () => {
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
  const [editedStudent, setEditedStudent] = useState(null);
  const [currentStudentData, setCurrentStudentData] = useState({});

  const handleStudentEdit = (student) => {
    setEditedStudent(student);
    setCurrentStudentData(student);
    setEditModalOpen(true);
  };

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
        <h1 className="text-text text-3xl text-center mb-6">Группы</h1>
        {/* Выбор группы */}
        <div className="mb-4 flex gap-4 items-center">
          <select
            onChange={(e) => handleGroupSelect(e.target.value)}
            className="w-full p-2 bg-field-bg text-text rounded"
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
            className="p-2 bg-btn-primary-bg text-btn-primary rounded hover:bg-btn-primary-hover whitespace-nowrap"
          >
            Добавить студента
          </button>
        </div>

        {/* Модальное окно добавления */}
        {showAddForm && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={closeModal}
          >
            <div className="bg-table-bg p-6 rounded-lg w-96" onClick={(e) => e.stopPropagation()}>
              <h2 className="text-text text-xl mb-4">Добавить студента в группу</h2>
              <form onSubmit={handleAddStudent}>
                <div className="space-y-4">
                  <div>
                    <label className="text-text">Студент:</label>
                    <select
                      value={formData.student_id}
                      onChange={(e) =>
                        setFormData({ ...formData, student_id: e.target.value })
                      }
                      className="w-full p-2 bg-field-bg text-text rounded mt-1"
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
                    <label className="text-text">Группа:</label>
                    <select
                      value={formData.group_id}
                      onChange={(e) =>
                        setFormData({ ...formData, group_id: e.target.value })
                      }
                      className="w-full p-2 bg-field-bg text-text rounded mt-1"
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
                    className="p-2 bg-btn-primary-bg text-btn-primary rounded hover:bg-btn-primary-hover"
                  >
                    Добавить
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Информация о группе и таблица студентов */}
        {selectedGroup && (
        <div className="flex gap-8 mt-8">
          {/* ... карточка информации о группе ... */}

          <div className="w-2/3">
            <h2 className="text-text text-xl mb-4">Студенты группы</h2>
            <GenericTable
              config={groupStudentsConfig}
              data={selectedGroup.students.map(student => ({
                ...student,
                fio: `${student.surname} ${student.name} ${student.lastname || ""}`
              }))}
              onRowClick={handleStudentEdit}
              customRender={{
                fio: (row) => `${row.surname} ${row.name} ${row.lastname || ""}`,
                entrance: (row) => row.entrance ? "Да" : "Нет"
              }}
              disablePagination
              disableSearch
              disableHeaderTools
            />
          </div>
        </div>
      )}

      <ModalEdit
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        columnsConfig={studentsConfig.columns} // Ваш конфиг из StudentsPage
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