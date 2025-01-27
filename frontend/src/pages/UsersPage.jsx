// UsersTable.jsx
import React from "react";
import GenericTable from "../components/GenericTable";
import Form from "../components/Form.jsx";

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
  login: "",
  password: "",
  name: "",
  surname: "",
  lastname: "",
  privilege: ""
};

const userFieldsConfig = [
  { key: "login", title: "Логин", required: true },
  { key: "password", title: "Пароль", inputType: "password", required: true },
  { key: "name", title: "Имя", required: true},
  { key: "surname", title: "Фамилия", required: true },
  { key: "lastname", title: "Отчество" },
  { key: "privilege", title: "Привилегия", inputType: "number"},
];

const UsersTable = () => (
  <GenericTable
    config={usersConfig}
    FormComponent={Form}
    apiEndpoint="http://localhost:8000/api/user"
    defaultFormData={defaultUserData}
    pageTitle="Пользователи"
    fieldsConfig={userFieldsConfig} // Передаем fieldsConfig
  />
);

export default UsersTable;