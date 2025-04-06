const SearchPanel = ({
  searchQuery,
  selectedGroup,
  groups,
  onSearchChange,
  onGroupFilterChange,
  onAddClick,
  onDeleteClick,
  selectedCount
}) => {
  return (
    <div className="mb-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
      <h1 className="text-2xl font-semibold text-gray-800">Студенты</h1>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <input
              type="search"
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Поиск студентов..."
              value={searchQuery}
              onChange={onSearchChange}
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
          </div>

          <div className="relative">
            <select
              className="block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={selectedGroup}
              onChange={onGroupFilterChange}
            >
              <option value="">Все группы</option>
              {groups.map(group => (
                <option key={group.id} value={group.name}>{group.name}</option>
              ))}
            </select>
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="fas fa-users text-gray-400"></i>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onAddClick}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>
            Добавить
          </button>

          <button
            onClick={onDeleteClick}
            disabled={selectedCount === 0}
            className={`inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md shadow-sm ${
              selectedCount > 0 
                ? 'border-red-300 text-red-700 bg-white hover:bg-red-50' 
                : 'border-gray-300 text-gray-300 bg-white cursor-not-allowed'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors`}
          >
            <i className="fas fa-trash-alt mr-2"></i>
            Удалить
            {selectedCount > 0 && ` (${selectedCount})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchPanel;
