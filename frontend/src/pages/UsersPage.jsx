import React from "react";
import Table from "../components/Table";

const UsersPage = () => {
  return (
    <div>
      <div className="m-auto max-w-2xl mt-16">
        <h1 className="text-text text-3xl mb-4 text-center">Пользователи</h1>
      </div>
      <Table />
    </div>
  );
};

export default UsersPage;