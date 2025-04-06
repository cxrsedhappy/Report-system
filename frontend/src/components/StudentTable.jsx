import { useState } from 'react';

const StudentTable = ({
  students,
  loading,
  onEditClick,
  onDeleteClick,
  onSelectionChange,
  selectedStudents
}) => {
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    setSelectAll(isChecked);

    if (isChecked) {
      onSelectionChange(students.map(student => student.id));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectOne = (e, studentId) => {
    const isChecked = e.target.checked;

    if (isChecked) {
      onSelectionChange([...selectedStudents, studentId]);
    } else {
      onSelectionChange(selectedStudents.filter(id => id !== studentId));
    }
  };

  const getInitials = (name, surname) => {
    return (surname?.[0] || '') + (name?.[0] || '');
  };

  const columns = [
    { id: 'checkbox', width: '4%' },
    { id: 'student', label: 'Студент', width: '25%' },
    { id: 'educational_id', label: 'Номер студента', width: '15%' },
    { id: 'group', label: 'Группа', width: '12%' },
    { id: 'exams', label: 'Сданные практики', width: '12%' },
    { id: 'entrance', label: 'Пропуск', width: '12%' },
    { id: 'diploma', label: 'Дипломный проект', width: '12%' },
    { id: 'actions', label: 'Действия', width: '8%' }
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <p className="mt-4 text-gray-600">Загрузка студентов...</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <div className="bg-gray-50 rounded-md p-8 text-center">
        <i className="fas fa-user-graduate text-gray-400 text-4xl mb-4"></i>
        <h3 className="text-lg font-medium text-gray-900">Нет данных о студентах</h3>
        <p className="mt-2 text-sm text-gray-500">
          Студенты не найдены. Попробуйте изменить параметры поиска или добавьте нового студента.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(column => (
              <th
                key={column.id}
                style={{ width: column.width }}
                className={`px-6 py-3 text-${column.id === 'actions' ? 'right' : 'left'} text-xs font-medium text-gray-500 uppercase tracking-wider`}
              >
                {column.id === 'checkbox' ? (
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    checked={selectAll}
                    onChange={handleSelectAll}
                  />
                ) : column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {students.map(student => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={selectedStudents.includes(student.id)}
                  onChange={(e) => handleSelectOne(e, student.id)}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                    <span className="text-indigo-600 font-semibold">
                      {getInitials(student.name, student.surname)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {student.surname} {student.name} {student.lastname || ''}
                    </div>
                    <a className="text-sm text-gray-500">
                      {student.phone || 'Телефон не указан'}
                    </a>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {student.educational_id || 'Не указан'}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {student.group || "Не в группе"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {student.exams || "0"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {student.entrance ? (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Есть
                  </span>
                ) : (
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Отсутствует
                  </span>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {student.diploma || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEditClick(student)}
                  className="text-indigo-600 hover:text-indigo-900 mr-3"
                  title="Редактировать"
                >
                  <i className="fas fa-edit"></i>
                </button>
                <button
                  onClick={() => onDeleteClick(student.id)}
                  className="text-red-600 hover:text-red-900"
                  title="Удалить"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentTable;

