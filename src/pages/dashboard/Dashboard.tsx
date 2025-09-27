import { Routes, Route } from "react-router-dom";
import PageTitle from "../../components/dashboard/pageTitle/PageTitle";
import "./Dashboard.css"
import Gerenciar from "../../components/dashboard/gerenciar/Gerenciar";
import { useState } from "react";
import DashboardMenu from "../../components/dashboard/dashboardMenu/DashboardMenu";
import CadastrarFuncionario from "../../components/form/cadastrarFuncionario/CadastrarFuncionario";
import CadastrarOvino from "../../components/form/cadastrarOvino/CadastrarOvino";
import OvinoFullInfo from "../../components/dashboard/gerenciar/ovinoFullInfo/OvinoFullInfo";
import CadastrarReproducao from "../../components/form/cadastrarReproducao/CadastrarReproducao";
import GerenciarReproducoes from "../../components/dashboard/reproducoes/GerenciarReproducoes";
import CadastrarGestacao from "../../components/form/cadastrarGestacao/CadastrarGestacao";
import GerenciarGestacoes from "../../components/dashboard/gestacoes/GerenciarGestacoes";

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
          <Route path="ovinos/fullinfo" element={<OvinoFullInfo />} />
          <Route path="ovinos/reproducoes/criar" element={<CadastrarReproducao />}/>
          <Route path="ovinos/reproducoes/gerenciar" element={<GerenciarReproducoes/>}/>
          <Route path="ovinos/gestacoes/criar" element={<CadastrarGestacao/>}/>
          <Route path="ovinos/gestacoes/gerenciar" element={<GerenciarGestacoes/>}/>
        </Routes>
      </div>
    </div>
  );
};


export default Dashboard;
