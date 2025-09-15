import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import "./PageTitle.css";

import Ovelha from "../../../assets/icons/ovelha1.png";
import SearchBar from "../../common/searchBar/SearchBar";

interface PageTitleProps {
  onSearch: (query: string) => void;
}

const PageTitle: React.FC<PageTitleProps> = ({ onSearch }) => {
  const location = useLocation();
  const searchEnabled = location.pathname === "/dashboard/ovinos/gerenciar" || location.pathname === "/dashboard/funcionarios/gerenciar";

  const typeName = useMemo(() => {
    switch (location.pathname) {
      case "/dashboard/ovinos":
        return "Gerenciar Rebanho";
      case "/dashboard/ovinos/gerenciar":
        return "Gerenciar Rebanho"
      case "/dashboard/ovinos/cadastrar":
        return "Cadastrar Ovino"
      default:
        return "Gerenciar Funcionarios";
    }
  }, [location.pathname]);

  const filterOptions = [
    { label: "Ativos", value: "active" },
    { label: "Inativos", value: "inactive" },
    { label: "Favoritos", value: "favorite" },
  ];

  return (
    <div className={!searchEnabled ? "pageTitle-dashboard flex" : "pageTitle-container flex"}>
      <ul className="flex">
        <li className="pageTitle-line flex">
          <img src={Ovelha} alt="ovelha" />
          <h2>{typeName}</h2>
        </li>

        {searchEnabled && (
          <li>
            <SearchBar
              placeholder={
                location.pathname === "/dashboard/ovinos/gerenciar"
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
