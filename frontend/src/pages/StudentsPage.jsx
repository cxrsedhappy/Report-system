// StudentsTable.jsx
import React from "react";
import GenericTable from "../components/GenericTable";
import Form from "../components/Form.jsx";

const studentsConfig = {
  columns: [
    { key: "id", title: "ID" },
    { key: "educational_id", title: "Код Студента" },
    { key: "group", title: "Группа"},
    { key: "surname", title: "Фамилия" },
    { key: "name", title: "Имя" },
    { key: "lastname", title: "Отчество" },
    { key: "entrance", title: "Пропуск" },
    { key: "diploma", title: "Диплом" },
    { key: "exams", title: "Экзамены" },
  ]
};

const defaultStudentData = {
  educational_id: "",
  name: "",
  surname: "",
  lastname: "",
  entrance: 1
};

const studentFieldsConfig = [
  { key: "educational_id", title: "Код Студента", required: true },
  { key: "surname", title: "Фамилия" },
  { key: "name", title: "Имя" },
  { key: "lastname", title: "Отчество" },
  { key: "entrance", title: "Пропуск", inputType: "number" },
];

const StudentsPage = () => (
  <GenericTable
    config={studentsConfig}
    FormComponent={Form}
    apiEndpoint="http://localhost:8000/api/student"
    defaultFormData={defaultStudentData}
    pageTitle="Студенты"
    fieldsConfig={studentFieldsConfig} // Передаем fieldsConfig
  />
);

export default StudentsPage;