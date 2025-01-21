import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TableColumn = () => {
  const [users, setUsers] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage, setUsersPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    axios.get('http://localhost:8000/api/user')
      .then((response) => {
        const userData = response.data;
        setUsers(userData);
        if (userData.length > 0) {
          setColumns(Object.keys(userData[0]));
        }
        setLoading(false);
      })
      .catch((error) => {
        setError('Ошибка при запросе данных');
        setLoading(false);
        console.error('Ошибка при запросе данных:', error);
      });
  }, []);

  const filteredUsers = users.filter(user => {
    return Object.values(user).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const handleUsersPerPageChange = (event) => {
    setUsersPerPage(Number(event.target.value));
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return <div className="text-center text-xl text-accent">Загрузка...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-5 bg-bg text-text">
      <h1 className="text-3xl font-semibold text-center mt-14 mb-16">Таблица пользователей</h1>

      {/* Верхний блок с контролами */}
      <div className="flex justify-between items-center mb-4">
        {/* Пользователей на странице */}
        <div className="flex items-center space-x-2">
          <label htmlFor="users-per-page" className="text-sm">Пользователей на странице:</label>
          <select
            id="users-per-page"
            value={usersPerPage}
            onChange={handleUsersPerPageChange}
            className="bg-field-bg text-field px-3 py-2 rounded border border-gray-600"
          >
            {[5, 10, 15, 20].map(num => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
        </div>

        {/* Поле поиска */}
        <input
          type="text"
          placeholder="Поиск..."
          className="bg-field-bg text-field text-sm px-3 py-2 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-field-accent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Таблица пользователей */}
      <table className="w-full text-table-text border-collapse border border-gray-700">
        <thead>
          <tr className="bg-table-header text-header-color">
            {columns.map((column, index) => (
              <th key={index} className="px-4 py-2 text-left">{column}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user, index) => (
            <tr key={index} className="hover:bg-table-hover">
              {columns.map((column, colIndex) => (
                <td key={colIndex} className="px-4 py-2 border-b border-gray-700">{user[column]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Контролы пагинации */}
      <div className="flex justify-center items-center space-x-3 mt-5">
        <button
          className="px-4 py-2 bg-btn-primary-bg text-btn-primary rounded disabled:opacity-50"
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Предыдущая
        </button>

        {pageNumbers.map(number => (
          <button
            key={number}
            className={`px-4 py-2 rounded ${
              currentPage === number ? 'bg-accent text-white' : 'bg-btn-default-bg text-btn-default'
            }`}
            onClick={() => paginate(number)}
          >
            {number}
          </button>
        ))}

        <button
          className="px-4 py-2 bg-btn-primary-bg text-btn-primary rounded disabled:opacity-50"
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Следующая
        </button>
      </div>
    </div>
  );
};

export default TableColumn;
