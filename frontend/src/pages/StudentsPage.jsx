import { useState, useEffect, useCallback, useMemo } from 'react';

import ModalEdit from '../components/ModalEdit.jsx';
import ModalAdd from '../components/ModalAdd.jsx';
import ConfirmDialog from '../components/ConfirmDialog.jsx';
import StudentTable from '../components/StudentTable.jsx';
import SearchPanel from '../components/SearchPanel.jsx';
import Pagination from '../components/Pagination.jsx';

import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = "http://192.168.1.63:8000/api";
const STUDENTS_PER_PAGE = 5;

function StudentsPage() {
  const [groups, setGroups] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const [newStudent, setNewStudent] = useState({
    educational_id: '',
    name: '',
    surname: '',
    lastname: '',
    group_id: '',
    phone: '',
    entrance: '0'
  });

  const [currentPage, setCurrentPage] = useState(1);

  const fetchGroups = useCallback(async () => {
    try {
      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error("Авторизация не выполнена");
      }

      const groupResponse = await axios.get(
        `${BASE_URL}/group`,
        {headers: {Authorization: `Bearer ${token}`}}
      );
      setGroups(groupResponse.data);
    } catch (err) {
      console.error("Ошибка при загрузке групп:", err);
      setError("Не удалось загрузить группы. Пожалуйста, попробуйте позже.");
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      setLoading(true);
      const token = Cookies.get("access_token");
      if (!token) {
        throw new Error("Авторизация не выполнена");
      }

      const studentResponse = await axios.get(
        `${BASE_URL}/student`,
        {headers: {Authorization: `Bearer ${token}`}}
      );
      setStudents(studentResponse.data);
      setError(null);
    } catch (err) {
      console.error("Ошибка при загрузке студентов:", err);
      setError("Не удалось загрузить данные студентов. Пожалуйста, попробуйте позже.");
    } finally {
      setLoading(false);
    }
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch =
        (student.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (student.surname?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (student.lastname?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
        (student.educational_id?.toLowerCase() || '').includes(searchQuery.toLowerCase());

      const matchesGroup =
        selectedGroup === '' ||
        (student.group && student.group.toLowerCase() === selectedGroup.toLowerCase());

      return matchesSearch && matchesGroup;
    });
  }, [students, searchQuery, selectedGroup]);

  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * STUDENTS_PER_PAGE;
    return filteredStudents.slice(startIndex, startIndex + STUDENTS_PER_PAGE);
  }, [filteredStudents, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredStudents.length / STUDENTS_PER_PAGE);
  }, [filteredStudents]);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleGroupFilterChange = useCallback((e) => {
    setSelectedGroup(e.target.value);
  }, []);

  const handleEditClick = useCallback((student) => {
    setSelectedStudent({
      ...student,
      group_id: student.group_id || (student.group ?
        groups.find(g => g.name === student.group)?.id || '' : ''),
      entrance: student.entrance ? '1' : '0'
    });
    setIsEditModalOpen(true);
  }, [groups]);

  const handleSelectionChange = useCallback((studentIds) => {
    setSelectedStudents(studentIds);
  }, []);

  const handleSaveChanges = useCallback(async () => {
    try {
      setIsSaving(true);
      const token = Cookies.get('access_token');

      if (!selectedStudent) {
        throw new Error('Не выбран студент для редактирования');
      }

      const payload = [{
        id: selectedStudent.id,
        educational_id: selectedStudent.educational_id,
        name: selectedStudent.name,
        surname: selectedStudent.surname,
        lastname: selectedStudent.lastname,
        group_id: Number(selectedStudent.group_id) || null,
        phone: selectedStudent.phone || '',
        entrance: Boolean(Number(selectedStudent.entrance || 0))
      }];

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
  }, [selectedStudent, fetchStudents]);

  const handleDeleteStudent = useCallback(async () => {
    if (!selectedStudents.length) return;

    try {
      const token = Cookies.get("access_token");
      await axios.delete(`${BASE_URL}/student`, {
        headers: { Authorization: `Bearer ${token}` },
        data: selectedStudents,
      });

      await fetchStudents();
      setSelectedStudents([]);
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Ошибка при удалении студентов:", error);
      alert("Не удалось удалить выбранных студентов");
    }
  }, [selectedStudents, fetchStudents]);

  const handleAddStudent = useCallback(async () => {
    try {
      setIsSaving(true);
      const token = Cookies.get("access_token");

      const payload = {
        ...newStudent,
        group_id: newStudent.group_id ? Number(newStudent.group_id) : null,
        entrance: Boolean(Number(newStudent.entrance))
      };

      await axios.post(
        `${BASE_URL}/student`,
        payload,
        {headers: {Authorization: `Bearer ${token}`}}
      );

      await fetchStudents();
      setIsModalOpen(false);
      setNewStudent({
        educational_id: '',
        name: '',
        surname: '',
        lastname: '',
        group_id: '',
        phone: '',
        entrance: '0'
      });
    } catch (error) {
      console.error("Ошибка при добавлении студента:", error);
      alert("Не удалось добавить студента. Проверьте введенные данные.");
    } finally {
      setIsSaving(false);
    }
  }, [newStudent, fetchStudents]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedGroup]);

  useEffect(() => {
    fetchStudents();
    fetchGroups();
  }, [fetchStudents, fetchGroups]);

  return (
    <>
      <ModalAdd
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        newStudent={newStudent}
        setNewStudent={setNewStudent}
        onSave={handleAddStudent}
        isLoading={isSaving}
        groups={groups}
      />

      <ModalEdit
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editedData={selectedStudent}
        setEditedData={setSelectedStudent}
        onSave={handleSaveChanges}
        isLoading={isSaving}
        groups={groups}
      />

      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteStudent}
        title="Удаление студентов"
        message={`Вы уверены, что хотите удалить выбранных студентов (${selectedStudents.length})?`}
      />

      <main className="flex-grow container mx-auto px-4 py-8 mt-16">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            <i className="fas fa-exclamation-circle mr-2"></i>
            {error}
          </div>
        )}

        <SearchPanel
          searchQuery={searchQuery}
          selectedGroup={selectedGroup}
          groups={groups}
          onSearchChange={handleSearchChange}
          onGroupFilterChange={handleGroupFilterChange}
          onAddClick={() => setIsModalOpen(true)}
          onDeleteClick={() => selectedStudents.length > 0 && setIsDeleteDialogOpen(true)}
          selectedCount={selectedStudents.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        <StudentTable
          students={paginatedStudents}
          loading={loading}
          onEditClick={handleEditClick}
          onDeleteClick={(id) => {
            setSelectedStudents([id]);
            setIsDeleteDialogOpen(true);
          }}
          onSelectionChange={handleSelectionChange}
          selectedStudents={selectedStudents}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </main>
    </>
  );
}

export default StudentsPage;