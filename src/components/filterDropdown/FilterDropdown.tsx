import React, { useState } from "react";

interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  filterOptions: FilterOption[];
  selectedFilters: string[];
  onFilterChange: (filters: string[]) => void;
}

const FilterDropdown: React.FC<FilterDropdownProps> = ({
  filterOptions,
  selectedFilters,
  onFilterChange,
}) => {
  const [open, setOpen] = useState(false);

  const toggleFilter = (value: string) => {
    let updated: string[];
    if (selectedFilters.includes(value)) {
      updated = selectedFilters.filter(f => f !== value);
    } else {
      updated = [...selectedFilters, value];
    }
    onFilterChange(updated);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="px-4 py-2 border rounded-xl bg-white shadow flex items-center justify-between w-48"
      >
        Filtros
        <span className="ml-2">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="absolute mt-2 w-48 bg-white border rounded-xl shadow z-10 p-2 flex flex-col gap-2">
          {filterOptions.map(filter => (
            <label key={filter.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedFilters.includes(filter.value)}
                onChange={() => toggleFilter(filter.value)}
                className="accent-blue-500"
              />
              <span>{filter.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default FilterDropdown;
