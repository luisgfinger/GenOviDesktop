import { Routes, Route } from "react-router-dom";
import PageTitle from "../../components/dashboard/pageTitle/PageTitle";
import "./Dashboard.css";
import Gerenciar from "../../components/dashboard/gerenciar/Gerenciar";
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
import GerenciarAplicacoes from "../../components/dashboard/aplicacoes/GerenciarAplicacoes";
import GerenciarRegistros from "../../components/dashboard/registros/GerenciarRegistros";
import CadastrarCompraComOvinos from "../../components/form/cadastrarCompra/CadastrarCompraComOvinos";
import GerenciarCompras from "../../components/dashboard/compra/GerenciarCompras";
import CadastrarUsuario from "../../components/form/cadastrarUsuario/CadastrarUsuario";
import GerenciarUsuarios from "../../components/dashboard/usuarios/GerenciarUsuarios";
import CadastrarPesagem from "../../components/form/cadastrarPesagem/CadastrarPesagem";
import GerenciarPesagens from "../../components/dashboard/pesagens/GerenciarPesagens";
import ChatIA from "../../components/dashboard/chatIA/ChatIA";
import AdminRoute from "../../routes/AdminRoute";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container flex">
      <div className="dashboard-inside flex-column">
        <PageTitle />
        <Routes>
          <Route element={<AdminRoute />}>
            <Route
              path="funcionarios/gerenciar"
              element={<Gerenciar type="funcionario" />}
            />
            <Route
              path="funcionarios/cadastrar"
              element={<CadastrarFuncionario />}
            />
            <Route path="usuarios" element={<GerenciarUsuarios />} />
            <Route path="usuarios/cadastrar" element={<CadastrarUsuario />} />

            <Route path="ovinos/doencas/criar" element={<CadastrarDoenca />} />
            <Route
              path="ovinos/medicamentos/criar"
              element={<CadastrarMedicamento isVacina={false} />}
            />
            <Route
              path="ovinos/vacinas/criar"
              element={<CadastrarMedicamento isVacina={true} />}
            />

            <Route
              path="ovinos/compra/criar"
              element={<CadastrarCompraComOvinos />}
            />
            <Route
              path="ovinos/compra/gerenciar"
              element={<GerenciarCompras />}
            />
          </Route>
          <Route path="ovinos" element={<DashboardMenu />} />
          <Route path="ovinos/gerenciar" element={<Gerenciar type="ovino" />} />
          <Route path="ovinos/cadastrar" element={<CadastrarOvino />} />
          <Route path="ovinos/fullinfo/*" element={<OvinoFullInfo />} />
          <Route
            path="ovinos/reproducoes/criar"
            element={<CadastrarReproducao />}
          />
          <Route
            path="ovinos/reproducoes/gerenciar"
            element={<GerenciarReproducoes />}
          />
          <Route
            path="ovinos/gestacoes/criar"
            element={<CadastrarGestacao />}
          />
          <Route
            path="ovinos/gestacoes/gerenciar"
            element={<GerenciarGestacoes />}
          />

          <Route
            path="ovinos/partos/criar"
            element={<CadastrarPartoComFilhotes />}
          />
          <Route path="ovinos/partos/gerenciar" element={<GerenciarPartos />} />

          <Route
            path="ovinos/doencas/gerenciar"
            element={<GerenciarDoencas />}
          />
          <Route
            path="ovinos/doencas/adoecimento"
            element={<CadastrarOcorrenciaDoenca />}
          />
          <Route
            path="ovinos/doencas/doentes"
            element={<GerenciarOcorrenciaDoencas />}
          />

          <Route
            path="ovinos/medicamentos/gerenciar"
            element={<GerenciarMedicamentos isVacina={false} />}
          />

          <Route
            path="ovinos/aplicacoes/cadastrar/medicamento"
            element={<CadastrarAplicacao isVacina={false} />}
          />
          <Route
            path="ovinos/aplicacoes/cadastrar/vacina"
            element={<CadastrarAplicacao isVacina={true} />}
          />

          <Route
            path="ovinos/vacinas/gerenciar"
            element={<GerenciarMedicamentos isVacina={true} />}
          />
          <Route
            path="ovinos/vacinas/vacinacoes"
            element={<GerenciarAplicacoes isVacina={true} />}
          />

          <Route
            path="ovinos/medicamentos/medicacoes"
            element={<GerenciarAplicacoes isVacina={false} />}
          />

          <Route path="/registros" element={<GerenciarRegistros />} />
          <Route path="ovinos/pesagens/criar" element={<CadastrarPesagem />} />
          <Route
            path="ovinos/pesagens/gerenciar"
            element={<GerenciarPesagens />}
          />
          <Route path="/ia" element={<ChatIA />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;
