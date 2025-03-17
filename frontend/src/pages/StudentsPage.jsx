import {useEffect, useState} from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ModalEdit from "../components/ModalEdit.jsx";

const BASE_URL = "http://192.168.1.63:8000/api"

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
              {[
                { label: 'Код студента', key: 'educational_id', type: 'text' },
                { label: 'Имя', key: 'name', type: 'text' },
                { label: 'Фамилия', key: 'surname', type: 'text' },
                { label: 'Отчество', key: 'lastname', type: 'text' },
                {
                  label: 'Группа',
                  key: 'group_id',
                  type: 'select',
                  options: groups.map(g => ({ value: g.id, label: g.name }) )
                },
                {
                  label: 'Пропуск',
                  key: 'entrance',
                  type: 'select',
                  options: [{ value: 1, label: 'Есть' }, { value: 0, label: 'Отсутствует' }]
                },
                { label: 'Телефон', key: 'phone', type: 'tel' }
              ].map(({ label, key, type, options }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  {type === 'select' ? (
                    <select
                      className="w-full px-3 py-2 border rounded-md"
                      value={newStudent[key]}
                      onChange={e => setNewStudent({...newStudent, [key]: e.target.value})}
                    >
                      {key === 'group_id' && <option value="">Выберите группу</option>}
                      {options?.map(({ value, label }) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  ) : (
                    <input
                      type={type}
                      className="w-full px-3 py-2 border rounded-md"
                      value={newStudent[key]}
                      onChange={e => setNewStudent({...newStudent, [key]: e.target.value})}
                    />
                  )}
                </div>
              ))}
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
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-gray-800">Студенты</h1>
            <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              {[
                {
                  type: 'search',
                  icon: 'search',
                  placeholder: 'Поиск...',
                  value: searchQuery,
                  onChange: handleSearchChange
                },
                {
                  type: 'select',
                  icon: 'users',
                  options: groups,
                  value: selectedGroup,
                  onChange: handleGroupFilterChange
                }
              ].map((field, i) => (
                  <div key={i} className="relative">
                    {field.type === 'select' ? (
                        <select
                            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            value={field.value}
                            onChange={field.onChange}
                        >
                          <option value="">Все {field.type === 'select' ? 'группы' : ''}</option>
                          {field.options?.map(opt => (
                              <option key={opt.id} value={opt.name}>{opt.name}</option>
                          ))}
                        </select>
                    ) : (
                        <input
                            type={field.type}
                            className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder={field.placeholder}
                            value={field.value}
                            onChange={field.onChange}
                        />
                    )}
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <i className={`fas fa-${field.icon} text-gray-400`}></i>
                    </div>
                  </div>
              ))}

              <div className="flex space-x-3">
                {[
                  {icon: 'plus', text: 'Добавить', color: 'indigo', onClick: () => setIsModalOpen(true)},
                  {icon: 'trash-alt', text: 'Удалить', color: 'gray', onClick: handleDeleteStudent}
                ].map((btn, i) => (
                    <button
                        key={i}
                        onClick={btn.onClick}
                        className={`inline-flex items-center px-4 py-2 border ${
                            btn.color === 'indigo'
                                ? 'border-transparent text-white bg-indigo-600 hover:bg-indigo-700'
                                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                        } text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                    >
                      <i className={`fas fa-${btn.icon} mr-2`}></i>
                      {btn.text}
                    </button>
                ))}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
              <tr>
                {['checkbox', 'Студент', 'Номер студента', 'Группа', 'Сданные практики', 'Пропуск', 'Дипломный проект', 'Действия']
                    .map((header, i) => (
                        <th
                            key={i}
                            className={`px-6 py-3 text-${i === 7 ? 'right' : 'left'} text-xs font-${i === 0 ? 'medius' : 'medium'} text-gray-500 uppercase tracking-wider`}
                        >
                          {header === 'checkbox' ? (
                              <input type="checkbox"
                                     className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/>
                          ) : header}
                        </th>
                    ))}
              </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-gray-50 cursor-pointer">
                    {[
                      {
                        content: <input type="checkbox"
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"/>
                      },
                      {
                        content: (
                            <div className="flex items-center">
                              <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span
                                    className="text-indigo-600 font-semibold">{student.surname[0] + student.name[0]}</span>
                              </div>
                              <div className="ml-4">
                                <div
                                    className="text-sm font-medium text-gray-900">{student.surname + " " + student.name}</div>
                                <a className="text-sm text-gray-500">{student.phone}</a>
                              </div>
                            </div>
                        )
                      },
                      {content: student.educational_id},
                      {content: student.group || "Не в группе"},
                      {content: student.exams},
                      {
                        content: student.entrance ? (
                            <span
                                className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Есть</span>
                        ) : (
                            <span
                                className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Отсутствует</span>
                        )
                      },
                      {content: student.diploma || "-"},
                      {
                        content: (
                            <div className="text-right">
                              {[
                                {icon: 'edit', color: 'indigo', onClick: () => handleEditClick(student)},
                                {icon: 'trash', color: 'red', onClick: () => handleDeleteStudent([student.id])}
                              ].map((action, i) => (
                                  <a key={i} onClick={action.onClick}
                                     className={`text-${action.color}-600 hover:text-${action.color}-900 ${i > 0 ? 'ml-3' : ''}`}>
                                    <i className={`fas fa-${action.icon}`}></i>
                                  </a>

                              ))}
                            </div>
                        )
                      }
                    ].map((cell, i) => (
                        <td key={i} className={`px-6 py-4 whitespace-nowrap${i === 7 ? ' text-right' : ''}`}>
                          {cell.content}
                        </td>
                    ))}
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
