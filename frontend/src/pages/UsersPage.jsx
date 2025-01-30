// UsersTable.jsx
import GenericTable from "../components/GenericTable";
import Form from "../components/Form.jsx";

const usersConfig = {
  columns: [
    { key: "id", title: "ID", width: "5%" }, // Пример ширины для колонки ID
    { key: "login", title: "Логин", width: "28%" }, // Пример ширины для колонки Логин
    { key: "name", title: "Имя", width: "19%" }, // Пример ширины для колонки Имя
    { key: "surname", title: "Фамилия", width: "19%" }, // Пример ширины для колонки Фамилия
    { key: "lastname", title: "Отчество", width: "19%" }, // Пример ширины для колонки Отчество
    { key: "privilege", title: "Привилегия", inputType: "number", width: "10%" }, // Пример ширины для колонки Привилегия
  ],
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
    apiEndpoint="http://192.168.1.63:8000/api/user"
    defaultFormData={defaultUserData}
    pageTitle="Пользователи"
    fieldsConfig={userFieldsConfig} // Передаем fieldsConfig
  />
);

export default UsersTable;