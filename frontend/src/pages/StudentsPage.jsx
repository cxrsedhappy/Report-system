import {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ModalEdit from "../components/ModalEdit.jsx";

const BASE_URL = "http://192.168.1.63:8000/api"

function deleteCallback() {
  alert("Delete callback");
}

function StudentsPage() {
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [newStudent, setNewStudent] = useState({
    educational_id: '',
    name: '',
    surname: '',
    lastname: '',
    group_id: null,
    phone: '',
    entrance: 0
  });

  const fetchGroups = async () => {
    try {
      const token = Cookies.get("access_token");
      const groupResponse = await axios.get(
          BASE_URL + "/group",
          {headers: {Authorization: `Bearer ${token}`}}
      );
      setGroups(groupResponse.data)
    } finally { /* empty */ }
  }

  const fetchStudents = async () => {
    try {
      const token = Cookies.get("access_token");
      const studentResponse = await axios.get(
          BASE_URL + "/student",
          {headers: {Authorization: `Bearer ${token}`}}
      );
      setStudents(studentResponse.data)
    } finally { /* empty */ }
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.surname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.educational_id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGroup =
      selectedGroup === '' ||
      (student.group && student.group.toLowerCase() === selectedGroup.toLowerCase());

    return matchesSearch && matchesGroup;
  });

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleGroupFilterChange = (e) => {
    setSelectedGroup(e.target.value);
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleSaveChanges = async () => {
  try {
    setIsSaving(true);
    const token = Cookies.get('access_token');

    const payload = [
      {
        id: selectedStudent.id,
        educational_id: selectedStudent.educational_id,
        name: selectedStudent.name,
        surname: selectedStudent.surname,
        lastname: selectedStudent.lastname,
        group_id: Number(selectedStudent.group_id),
        phone: selectedStudent.phone,
        entrance: Boolean(Number(selectedStudent.entrance))
      }
    ];

    await axios.put(
      `${BASE_URL}/student`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    await fetchStudents();
    setIsEditModalOpen(false);

  } catch (error) {
    console.error('Ошибка сохранения:', error);
    alert('Произошла ошибка при сохранении изменений');
  } finally {
    setIsSaving(false);
  }
};

  const handleDeleteStudent = async (studentId) => {
    try {
      const token = Cookies.get("access_token");
      await axios.delete(BASE_URL + "/student", {
        headers: { Authorization: `Bearer ${token}` },
        data: Array.from(studentId),
      });
      fetchStudents();
    } catch (error) {
      console.error("Ошибка при удалении студента:", error);
    }
  };

  const handleAddStudent = async () => {
    try {
      const token = Cookies.get("access_token");
      await axios.post(
        BASE_URL + "/student",
        newStudent,
        {headers: {Authorization: `Bearer ${token}`}}
      );
      fetchStudents();
      setIsModalOpen(false);
      setNewStudent({
        educational_id: '',
        name: '',
        surname: '',
        lastname: '',
        group_id: null,
        phone: '',
        entrance: 0
      });
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  useEffect( () => {
    fetchStudents();
    fetchGroups();
  }, []);

  return (
    <>
      {isModalOpen && (
      <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <h2 className="text-2xl font-semibold mb-6">Добавить студента</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Код студента
              </label>
              <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={newStudent.educational_id}
                  onChange={(e) => setNewStudent({...newStudent, educational_id: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Имя
              </label>
              <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={newStudent.name}
                  onChange={(e) => setNewStudent({...newStudent, name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Фамилия
              </label>
              <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={newStudent.surname}
                  onChange={(e) => setNewStudent({...newStudent, surname: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Отчество
              </label>
              <input
                  type="text"
                  className="w-full px-3 py-2 border rounded-md"
                  value={newStudent.lastname}
                  onChange={(e) => setNewStudent({...newStudent, lastname: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Группа
              </label>
              <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={newStudent.group_id}
                  onChange={(e) => setNewStudent({...newStudent, group_id: e.target.value})}
              >
                <option value="">Выберите группу</option>
                {groups.map(group => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пропуск
              </label>
              <select
                  className="w-full px-3 py-2 border rounded-md"
                  value={newStudent.entrance}
                  onChange={(e) => setNewStudent({...newStudent, entrance: e.target.value})}
              >
                {[{1: "Есть"}, {0: "Отсутствует"}].map((item, index) => (
                    <option key={index} value={Object.keys(item)[0]}>{Object.values(item)[0]}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон
              </label>
              <input
                  type="tel"
                  className="w-full px-3 py-2 border rounded-md"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({...newStudent, phone: e.target.value})}
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Отмена
            </button>
            <button
                onClick={handleAddStudent}
                className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
      )}

      {isEditModalOpen && selectedStudent && (
      <ModalEdit
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editedData={selectedStudent}
        setEditedData={setSelectedStudent}
        onSave={handleSaveChanges}
        isLoading={isSaving}
        groups={groups}
      />
      )}

      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        <div className={"bg-white rounded-lg shadow-md p-6"}>
          <div
            className={
              "mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between"
            }
          >
            <h1 className={"text-2xl font-semibold text-gray-800"}>Студенты</h1>
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">

              <div className="relative">
                <input
                    type="text"
                    placeholder="Поиск..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-search text-gray-400"></i>
                </div>
              </div>

              <div className="relative group-filter-container">
                <select
                    id="group-filter"
                    value={selectedGroup}
                    onChange={handleGroupFilterChange}
                    className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    size="1"
                >
                  <option value="">Все группы</option>
                  {groups.map((group) => (
                      <option key={group.id} value={group.name}>{group.name}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="fas fa-users text-gray-400"></i>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <i className="fas fa-plus mr-2"></i>
                  Добавить
                </button>
                <button
                    onClick={deleteCallback}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <i className="fas fa-trash-alt mr-2"></i>
                  Удалить
                </button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
              <tr>
                <th
                    scope="col"
                    className="w-12 px-6 py-3 text-left text-xs font-medius text-gray-500 uppercase tracking-wider"
                >
                  <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                </th>
                <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Студент
                </th>
                <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Номер студента
                </th>
                <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Группа
                </th>
                <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Сданные практики
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Пропуск
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Дипломный проект
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Действия
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-gray-50 cursor-pointer"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold">{student.surname[0] + student.name[0]}</span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {student.surname + " " + student.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          <a>{student.phone}</a>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.educational_id}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.group ? student.group : "Не в группе"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{student.exams}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {student.entrance === true ? (
                        <span
                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Есть
                    </span>
                    ) : (
                        <span
                            className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                      Отсутствует
                    </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.diploma ? student.diploma : "-"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <a onClick={() => handleEditClick(student)} className="text-indigo-600 hover:text-indigo-900 mr-3">
                      <i className="fas fa-edit"></i>
                    </a>
                    <a onClick={() => handleDeleteStudent([student.id])} className="text-red-600 hover:text-red-900">
                      <i className="fas fa-trash"></i>
                    </a>
                  </td>
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

export default StudentsPage;
