// UsersTable.jsx
import React from "react";
import GenericTable from "../components/GenericTable";
import UserForm from "../components/UserForm.jsx";

const usersConfig = {
  columns: [
    { key: "id", title: "ID" },
    { key: "login", title: "Логин" },
    { key: "name", title: "Имя" },
    { key: "surname", title: "Фамилия" },
    { key: "lastname", title: "Отчество" },
    { key: "privilege", title: "Привилегия", inputType: "number" }
  ]
};

const defaultUserData = {
  id: "",
  login: "",
  password: "",
  name: "",
  surname: "",
  lastname: "",
  privilege: 0
};

const UsersTable = () => (
  <GenericTable
    config={usersConfig}
    FormComponent={UserForm}
    apiEndpoint="http://localhost:8000/api/user"
    defaultFormData={defaultUserData}
    pageTitle="Пользователи"
  />
);

export default UsersTable;