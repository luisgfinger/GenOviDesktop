import { Routes, Route } from "react-router-dom";
import PageTitle from "../../components/dashboard/pageTitle/PageTitle";
import "./Dashboard.css"
import Gerenciar from "../../components/dashboard/gerenciar/Gerenciar";
import { useState } from "react";
import DashboardMenu from "../../components/dashboard/dashboardMenu/DashboardMenu";
import CadastrarOvino from "../../components/form/cadastrarOvino/CadastrarOvino";
import CadastrarCriador from "../../components/form/cadastrarCriador/CadastrarCriador";

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
            path="criadores"
            element={<DashboardMenu location="criadores"/>}
          />
          <Route
            path="criadores/gerenciar"
            element={<Gerenciar searchQuery={searchQuery} type="criador"/>}
          />
           <Route
            path="criadores/cadastrar"
            element={<CadastrarCriador/>}
          />
        </Routes>
      </div>
    </div>
  );
};


export default Dashboard;
