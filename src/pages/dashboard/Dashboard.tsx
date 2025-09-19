import { Routes, Route } from "react-router-dom";
import PageTitle from "../../components/dashboard/pageTitle/PageTitle";
import "./Dashboard.css"
import Gerenciar from "../../components/dashboard/gerenciar/Gerenciar";
import { useState } from "react";
import DashboardMenu from "../../components/dashboard/dashboardMenu/DashboardMenu";
import CadastrarFuncionario from "../../components/form/cadastrarFuncionario/CadastrarFuncionario";
import CadastrarOvino from "../../components/form/cadastrarOvino/CadastrarOvino";

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="dashboard-container flex">
      <div className="dashboard-inside flex-column">
        <PageTitle onSearch={setSearchQuery} />
        <Routes>
          <Route path="ovinos" element={<DashboardMenu location="ovino"/>} />
          <Route
            path="ovinos/gerenciar"
            element={<Gerenciar searchQuery={searchQuery} type="ovino"/>}
          />
           <Route
            path="ovinos/cadastrar"
            element={<CadastrarOvino/>}
          />
          <Route
            path="funcionarios"
            element={<DashboardMenu location="funcionarios"/>}
          />
          <Route
            path="funcionarios/gerenciar"
            element={<Gerenciar searchQuery={searchQuery} type="funcionario"/>}
          />
           <Route
            path="funcionarios/cadastrar"
            element={<CadastrarFuncionario/>}
          />
        </Routes>
      </div>
    </div>
  );
};


export default Dashboard;
