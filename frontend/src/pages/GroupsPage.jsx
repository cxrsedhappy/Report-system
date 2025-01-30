import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import LoadingBar from "../components/LoadingBar.jsx";

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

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("access_token");
        // Загрузка групп
        const groupsResponse = await axios.get("http://192.168.1.63:8000/api/group", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setGroups(groupsResponse.data[0]);
        // Загрузка студентов
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
      const response = await axios.get(`http://192.168.1.63:8000/api/group?group_ids=${groupId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const groupData = response.data[0][0];
      // Если students_count отсутствует, вычисляем его
      groupData.students_count = groupData.students ? groupData.students.length : 0;
      setSelectedGroup(groupData);
      setFormData(prev => ({ ...prev, group_id: groupId }));
    } catch (err) {
      console.error("Ошибка загрузки группы:", err);
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
            {/* Карточка информации о группе */}
            <div className="w-1/3 p-4 bg-table-bg rounded-lg shadow-md">
              <h2 className="text-text text-xl font-bold mb-4">Информация о группе</h2>
              <p className="text-text">
                <strong>ID Группы:</strong> {selectedGroup.id}
              </p>
              <p className="text-text">
                <strong>Название группы:</strong> {selectedGroup.name}
              </p>
              <p className="text-text">
                <strong>Количество студентов:</strong> {selectedGroup.students_count || 0}
              </p>
              <p className="text-text">
                <strong>Дата создания:</strong>{" "}
                {new Date(selectedGroup.created_at).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>

            {/* Таблица студентов группы */}
            <div className="w-2/3">
              <h2 className="text-text text-xl mb-4">Студенты группы</h2>
              <table className="table-auto bg-table-bg w-full text-left text-text">
                <thead className="bg-table-hover">
                  <tr>
                    <th className="p-2">ID</th>
                    <th className="p-2">ФИО</th>
                    <th className="p-2">Код студента</th>
                    <th className="p-2">Пропуск</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedGroup.students.map((student) => (
                    <tr key={student.id}>
                      <td className="p-2">{student.id}</td>
                      <td className="p-2">
                        {`${student.surname} ${student.name} ${student.lastname || ""}`}
                      </td>
                      <td className="p-2">{student.educational_id}</td>
                      <td className="p-2">{student.entrance ? "Да" : "Нет"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupsPage;