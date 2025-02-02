import {useEffect, useRef} from "react";

const GenericTable = ({config, data, selectedRows, onSelectedRowsChange, onRowClick}) => {
  const masterCheckboxRef = useRef(null);

  useEffect(() => {
    if (masterCheckboxRef.current) {
      masterCheckboxRef.current.indeterminate =
        selectedRows.size > 0 && selectedRows.size < data.length;
    }
  }, [selectedRows, data.length]);

  const handleMasterCheckbox = (e) => {
    const newSelection = e.target.checked
      ? new Set(data.map(item => item.id))
      : new Set();
    onSelectedRowsChange(newSelection);
  };

  const handleRowCheckbox = (e, id) => {
    const newSelection = new Set(selectedRows);
    e.target.checked ? newSelection.add(id) : newSelection.delete(id);
    onSelectedRowsChange(newSelection);
    e.stopPropagation();
  };

  return (
    <table className="table-auto bg-table-bg w-full text-left text-text">
      <thead className="bg-table-hover">
        <tr>
          <th className="h-12" style={{ width: "10px" }}>
            <div className="w-10 flex items-center">
              <input
                type="checkbox"
                ref={masterCheckboxRef}
                onChange={handleMasterCheckbox}
                checked={selectedRows.size === data.length && data.length > 0}
              />
            </div>
          </th>
          {config.columns.map((column) => (
            <th
              key={column.key}
              className="h-6 p-2"
              style={{ width: column.width }}
            >
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr
            key={row.id}
            className={`cursor-pointer transition-colors duration-200 ${
              selectedRows.has(row.id)
                ? "bg-selected"
                : "hover:bg-table-hover"
            }`}
            onClick={() => onRowClick(row)}
          >
            <td className="border-0" style={{ width: "50px" }}>
              <div className="w-10 flex items-center">
                <input
                  type="checkbox"
                  className="m-auto accent-bg-hover hover:accent-pink-500"
                  checked={selectedRows.has(row.id)}
                  onChange={(e) => handleRowCheckbox(e, row.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </td>
            {config.columns.map((column) => (
              <td
                key={column.key}
                className="p-2"
                style={{ width: column.width }}
              >
                {column.type === "boolean"
                  ? row[column.key] ? "Да" : "Нет"
                  : row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default GenericTable;