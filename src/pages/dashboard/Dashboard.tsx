import { Routes, Route } from "react-router-dom";
import SideMenu from "../../components/side-menu/SideMenu";
import PageTitle from "../../components/pageTitle/PageTitle";
import "./Dashboard.css"
import GerenciarOvinos from "../../components/gerenciarOvinos/GerenciarOvinos";
import { useState } from "react";
import DashboardMenu from "../../components/dashboardMenu/DashboardMenu";
import CadastrarOvino from "../../components/cadastrarOvino/CadastrarOvino";

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="dashboard-container flex">
      <SideMenu />
      <div className="dashboard-inside flex-column">
        <PageTitle onSearch={setSearchQuery} />
        <Routes>
          <Route path="ovinos" element={<DashboardMenu location="ovino"/>} />
          <Route
            path="ovinos/gerenciar"
            element={<GerenciarOvinos searchQuery={searchQuery} />}
          />
           <Route
            path="ovinos/cadastrar"
            element={<CadastrarOvino/>}
          />
          <Route
            path="criadores"
            element={<DashboardMenu location="criadores"/>}
          />
        </Routes>
      </div>
    </div>
  );
};


export default Dashboard;
