import React from "react";
import { useLocation } from "react-router-dom";
import "./PageTitle.css";

import Ovelha from "../../assets/icons/ovelha1.png";
import SearchBar from "../searchBar/SearchBar";

const PageTitle: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard/ovinos";

  const sortOptions = [
    { label: "Mais recentes", value: "recent" },
    { label: "Mais antigos", value: "oldest" },
    { label: "A-Z", value: "asc" },
    { label: "Z-A", value: "desc" },
  ];

  const filterOptions = [
    { label: "Ativos", value: "active" },
    { label: "Inativos", value: "inactive" },
    { label: "Favoritos", value: "favorite" },
  ];

  const handleSearch = (query: string) => {
    console.log("Busca:", query);
  };

  const handleSortChange = (sort: string) => {
    console.log("Ordenar por:", sort);
  };

  const handleFilterChange = (filters: string[]) => {
    console.log("Filtros:", filters);
  };

  return (
    <div
      className={
        isDashboard ? "pageTitle-dashboard flex" : "pageTitle-container flex-column"
      }
    >
      <ul>
        <li className="pageTitle-line flex">
          <img src={Ovelha} alt="ovelha" />
          <h2>GERENCIAR REBANHO</h2>
        </li>
        {isDashboard ? (
          <></>
        ) : (
          <li>
            <SearchBar
              placeholder="Pesquisar animal por nome, fbb ou id"
              onSearch={handleSearch}
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
              sortOptions={sortOptions}
              filterOptions={filterOptions}
            />
          </li>
        )}
      </ul>
    </div>
  );
};

export default PageTitle;
