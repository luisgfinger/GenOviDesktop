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
  onFilterChange: (filters: string[]) => void;
  filterOptions: FilterOption[];
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = "Buscar...",
  onSearch,
  filterOptions,
}) => {
  
  const [query, setQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
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
