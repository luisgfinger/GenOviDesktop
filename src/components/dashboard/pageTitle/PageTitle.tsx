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
  const searchEnabled =
    location.pathname === "/dashboard/ovinos/gerenciar" ||
    location.pathname === "/dashboard/funcionarios/gerenciar";

  const typeName = useMemo(() => {
    switch (location.pathname) {
      case "/dashboard/ovinos":
        return "Gerenciar Rebanho";
      case "/dashboard/ovinos/gerenciar":
        return "Gerenciar Rebanho";
      case "/dashboard/ovinos/cadastrar":
        return "Cadastrar Ovino";
      case "/dashboard/funcionarios/cadastrar":
        return "Cadastrar funcionário";
      case "/dashboard/funcionarios":
        return "Gerenciar Funcionário";
      case "/dashboard/funcionarios/gerenciar":
        return "Gerenciar Funcionários";
      case "/dashboard/ovinos/reproducoes/criar":
        return "Registrar Reprodução";
      case "/dashboard/ovinos/reproducoes/gerenciar":
        return "Gerenciar Reproduções";
      case "/dashboard/ovinos/gestacoes/criar":
        return "Registrar Gestação";
      case "/dashboard/ovinos/partos/criar":
        return "Registrar Parto";
      case "/dashboard/ovinos/partos/gerenciar":
        return "Gerenciar Partos";
      case "/dashboard/ovinos/gestacoes/gerenciar":
        return "Gerenciar Gestações";
      case "/dashboard/ovinos/doencas/criar":
        return "Cadastrar Doença";
      case "/dashboard/ovinos/doencas/gerenciar":
        return "Gerenciar Doenças";
      case "/dashboard/ovinos/doencas/adoecimento":
        return "Gerenciar Adoecimento";
      case "/dashboard/ovinos/doencas/doentes":
        return "Animais doentes";
      case "/dashboard/ovinos/medicamentos/criar":
        return "Cadastrar Medicamento";
      case "/dashboard/ovinos/medicamentos/gerenciar":
        return "Gerenciar Medicamentos";
      case "/dashboard/ovinos/medicamentos/aplicar":
        return "Registrar aplicação de medicamento";
      case "/dashboard/ovinos/vacinas/criar":
        return "Cadastrar Vacina";
      case "/dashboard/ovinos/vacinas/gerenciar":
        return "Gerenciar Vacinas";
      case "/dashboard/ovinos/vacinas/aplicar":
        return "Registrar aplicação de vacinas";
      case "/dashboard/ovinos/vacinas/vacinacoes":
        return "Vacinações";
      case "/dashboard/ovinos/medicamentos/medicacoes":
        return "Medicações";
      default:
        return "Dashboard";
    }
  }, [location.pathname]);

  const filterOptions = [
    { label: "Ativos", value: "active" },
    { label: "Inativos", value: "inactive" },
    { label: "Favoritos", value: "favorite" },
  ];

  return (
    <div
      className={
        !searchEnabled ? "pageTitle-dashboard flex" : "pageTitle-container flex"
      }
    >
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
