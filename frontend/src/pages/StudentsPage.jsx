// StudentsTable.jsx
import React from "react";
import GenericTable from "../components/GenericTable";
import UserForm from "../components/UserForm.jsx";

const studentsConfig = {
  columns: [
    { key: "full_name", title: "ФИО" },
    { key: "group", title: "Группа" },
    { key: "course", title: "Курс", inputType: "number" }
  ]
};

const defaultStudentData = {
  full_name: "",
  group: "",
  course: 1
};

const StudentsTable = () => (
  <GenericTable
    config={studentsConfig}
    FormComponent={UserForm}
    apiEndpoint="http://localhost:8000/api/students"
    defaultFormData={defaultStudentData}
    pageTitle="Студенты"
  />
);

export default StudentsTable;