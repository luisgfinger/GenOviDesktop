import { Routes, Route } from "react-router-dom";
import SideMenu from "../../components/side-menu/SideMenu";
import PageTitle from "../../components/pageTitle/PageTitle";
import OvinoMenu from "../../components/ovinoMenu/OvinoMenu";
import "./Dashboard.css"
import GerenciarOvinos from "../../components/gerenciarOvinos/GerenciarOvinos";
import { useState } from "react";

const Dashboard: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="dashboard-container flex">
      <SideMenu />
      <div className="dashboard-inside flex-column">
        <PageTitle onSearch={setSearchQuery} />
        <Routes>
          <Route path="ovinos" element={<OvinoMenu />} />
          <Route
            path="ovinos/gerenciar"
            element={<GerenciarOvinos searchQuery={searchQuery} />}
          />
        </Routes>
      </div>
    </div>
  );
};


export default Dashboard;
