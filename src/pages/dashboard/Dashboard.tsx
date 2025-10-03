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
import GerenciarPartos from "../../components/dashboard/partos/GerenciarPartos";
import CadastrarPartoComFilhotes from "../../components/form/cadastrarParto/CadastrarPartoComFilhotes";
import CadastrarDoenca from "../../components/form/cadastrarDoenca/CadastrarDoenca";
import GerenciarDoencas from "../../components/dashboard/doencas/GerenciarDoencas";
import CadastrarOcorrenciaDoenca from "../../components/form/cadastrarOcorrenciaDoenca/CadastrarOcorrenciaDoenca";
import GerenciarOcorrenciaDoencas from "../../components/dashboard/ocorrenciaDoencas/GerenciarOcorrenciaDoencas";
import CadastrarMedicamento from "../../components/form/cadastrarMedicamento/CadastrarMedicamento";
import GerenciarMedicamentos from "../../components/dashboard/medicamentos/GerenciarMedicamentos";
import CadastrarAplicacao from "../../components/form/cadastrarAplicacao/CadastrarAplicacao";

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
          <Route path="ovinos/partos/criar" element={<CadastrarPartoComFilhotes/>}/>
          <Route path="ovinos/partos/gerenciar" element={<GerenciarPartos/>}/>
          <Route path="ovinos/doencas/criar" element={<CadastrarDoenca />}/>
          <Route path="ovinos/doencas/gerenciar" element={<GerenciarDoencas searchQuery={searchQuery}/>}/>
          <Route path="ovinos/doencas/adoecimento" element={<CadastrarOcorrenciaDoenca />}/>
          <Route path="ovinos/doencas/doentes" element={<GerenciarOcorrenciaDoencas />}/>
          <Route path="ovinos/medicamentos/criar" element={<CadastrarMedicamento isVacina={false}/>}/>
          <Route path="ovinos/medicamentos/gerenciar" element={<GerenciarMedicamentos searchQuery={searchQuery} isVacina={false}/>}/>
          <Route path="ovinos/medicamentos/aplicar" element={<CadastrarAplicacao isVacina={false}/>}/>
          <Route path="ovinos/vacinas/aplicar" element={<CadastrarAplicacao isVacina={true}/>}/>
          <Route path="ovinos/vacinas/criar" element={<CadastrarMedicamento isVacina={true}/>}/>
           <Route path="ovinos/vacinas/gerenciar" element={<GerenciarMedicamentos searchQuery={searchQuery} isVacina={true}/>}/>
        </Routes>
      </div>
    </div>
  );
};


export default Dashboard;
