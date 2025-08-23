import React, { useState } from "react";

import "./SearchBar.css";

import Search from "../../assets/icons/search.png";
import FilterDropdown from "../filterDropdown/FilterDropdown";

interface FilterOption {
  label: string;
  value: string;
}

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch: (query: string) => void;
  onSortChange: (sort: string) => void;
  onFilterChange: (filters: string[]) => void;
  sortOptions: { label: string; value: string }[];
  filterOptions: FilterOption[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Buscar...",
  onSearch,
  onSortChange,
  onFilterChange,
  sortOptions,
  filterOptions,
}) => {
  const [query, setQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

 const handleSortChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  onSortChange(e.target.value);
};

  return (
    <div className="searchBar-container flex">
      <span className="searchIcon flex">
        <img src={Search} alt="search" />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleSearch}
        className="searchBar-input"
      />

      <div className="orderBy flex">
        <label className="">Ordenar por:</label>
        {sortOptions.map((opt) => (
          <label
            key={opt.value}
            className="flex"
          >
            <input
              type="radio"
              name="sort"
              value={opt.value}
              onChange={(e) => handleSortChange(e)}
            />
            {opt.label}
          </label>
        ))}
      </div>

      <div className="">
        <FilterDropdown
          filterOptions={filterOptions}
          selectedFilters={selectedFilters}
          onFilterChange={setSelectedFilters}
        />
      </div>
    </div>
  );
};

export default SearchBar;
