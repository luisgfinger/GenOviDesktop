import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import "./PageTitle.css";

import Ovelha from "../../assets/icons/ovelha1.png";
import SearchBar from "../searchBar/SearchBar";

interface PageTitleProps {
  onSearch: (query: string) => void;
}

const PageTitle: React.FC<PageTitleProps> = ({ onSearch }) => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard/ovinos";

  const typeName = useMemo(() => {
    switch (location.pathname) {
      case "/dashboard/ovinos/gerenciar":
        return "ovino";
      default:
        return "invalido";
    }
  }, [location.pathname]);

  const filterOptions = [
    { label: "Ativos", value: "active" },
    { label: "Inativos", value: "inactive" },
    { label: "Favoritos", value: "favorite" },
  ];

  return (
    <div className={isDashboard ? "pageTitle-dashboard flex" : "pageTitle-container flex-column"}>
      <ul>
        <li className="pageTitle-line flex">
          <img src={Ovelha} alt="ovelha" />
          <h2>GERENCIAR REBANHO</h2>
        </li>

        {!isDashboard && (
          <li>
            <SearchBar
              placeholder={
                typeName === "ovino"
                  ? "Pesquisar animal por nome, fbb ou id"
                  : "Pesquisar..."
              }
              onSearch={onSearch}
              onFilterChange={(filters) => console.log("Filtros:", filters)}
              filterOptions={filterOptions}
            />
          </li>
        )}
      </ul>
    </div>
  );
};


export default PageTitle;
