// pages/StudentsPage.jsx

const StudentsPage = () => {
  const columns = [
    { field: 'id', header: 'ID', width: '100px' },
    { field: 'fullName', header: 'ФИО' },
    { field: 'group', header: 'Группа' },
    { field: 'status', header: 'Статус' }
  ];

  return (
    <div className="p-4">
      <h1 className="text-3xl font-semibold text-text mb-8">Студенты</h1>
    </div>
  );
};

export default StudentsPage;