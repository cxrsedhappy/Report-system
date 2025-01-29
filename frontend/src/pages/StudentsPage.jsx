// StudentsTable.jsx
import GenericTable from "../components/GenericTable";
import Form from "../components/Form.jsx";

const studentsConfig = {
  columns: [
    { key: "id", title: "ID", width: "3%" },
    { key: "educational_id", title: "Код Студента", width: "11%" },
    { key: "group", title: "Группа", width: "11%" , disabled: true},
    { key: "surname", title: "Фамилия", width: "16%" },
    { key: "name", title: "Имя", width: "15%" },
    { key: "lastname", title: "Отчество", width: "15%" },
    { key: "entrance", title: "Пропуск", width: "10%", type: "boolean", inputType: "checkbox" },
    { key: "diploma", title: "Диплом", width: "10%", disabled: true },
    { key: "exams", title: "Экзамены", width: "10%", disabled: true},
  ]
};

const defaultStudentData = {
  educational_id: "",
  name: "",
  surname: "",
  lastname: "",
  entrance: 0
};

const studentFieldsConfig = [
  { key: "educational_id", title: "Код Студента", required: true },
  { key: "surname", title: "Фамилия" },
  { key: "name", title: "Имя" },
  { key: "lastname", title: "Отчество" },
  { key: "entrance", title: "Пропуск", type: "boolean", required: true},
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