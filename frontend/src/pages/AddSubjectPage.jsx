// pages/AddSubjectPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddSubjectPage = () => {
  const [subjectName, setSubjectName] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Здесь можно добавить логику для отправки данных на сервер
    console.log("Добавлен предмет:", subjectName);
    alert(`Предмет "${subjectName}" успешно добавлен!`);
    navigate("/"); // Перенаправление на главную страницу после добавления
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-96 bg-bg text-text">
      <h1 className="text-2xl font-semibold text-accent mb-4">Добавить предмет</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-80">
        <input
          type="text"
          placeholder="Название предмета"
          value={subjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          className="p-2 rounded border border-accent bg-field-bg text-text"
          required
        />
        <button
          type="submit"
          className="p-2 bg-field-bg text-primary rounded hover:bg-primary-hover transition duration-200"
        >
          Добавить
        </button>
      </form>
    </div>
  );
};

export default AddSubjectPage;