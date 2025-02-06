import {useContext, useEffect, useRef} from "react";
import {ThemeContext} from "../context/ThemeContext.jsx";

const GenericTable = ({config, data, selectedRows, onSelectedRowsChange, onRowClick}) => {
  const { theme } = useContext(ThemeContext);
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
    <table className={`table-auto w-full text-left`}>
      <thead>
        <tr className={`bg-${theme}-table-header duration-200`}>
          <th className="h-12 duration-200" style={{ width: "10px" }}>
            <div className="w-10 flex items-center duration-200">
              <input
                type="checkbox"
                ref={masterCheckboxRef}
                onChange={handleMasterCheckbox}
                checked={selectedRows.size === data.length && data.length > 0}
                className={`accent-${theme}-accent duration-200`}
              />
            </div>
          </th>
          {config.columns.map((column) => (
            <th
              key={column.key}
              className={`h-6 p-2 text-${theme}-text duration-200`}
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
            className={`cursor-pointer transition-colors duration-200 bg-${theme}-table-hover hover:bg-${theme}-table-bg ${
              selectedRows.has(row.id)
                ? `bg-${theme}-accent`
                : `hover:bg-${theme}-table-hover` 
            }`}
            onClick={() => onRowClick(row)}
          >
            <td className="border-0" style={{ width: "50px" }}>
              <div className="w-10 flex items-center">
                <input
                  type="checkbox"
                  className={`m-auto`}
                  checked={selectedRows.has(row.id)}
                  onChange={(e) => handleRowCheckbox(e, row.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </td>
            {config.columns.map((column) => (
              <td
                key={column.key}
                className={`p-2 text-${theme}-table-text`}
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