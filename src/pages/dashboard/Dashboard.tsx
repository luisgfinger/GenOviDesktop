import { Routes, Route } from "react-router-dom";
import SideMenu from "../../components/side-menu/SideMenu";
import PageTitle from "../../components/pageTitle/PageTitle";
import OvinoMenu from "../../components/ovinoMenu/OvinoMenu";
import "./Dashboard.css"
import GerenciarOvinos from "../../components/gerenciarOvinos/GerenciarOvinos";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container flex">
      <SideMenu />
      <div className="dashboard-inside flex-column">
        <PageTitle />
        <Routes>
          <Route path="ovinos" element={<OvinoMenu />} />
          <Route path="ovinos/gerenciar" element={<GerenciarOvinos/>}/>
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
