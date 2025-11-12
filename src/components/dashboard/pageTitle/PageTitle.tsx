import React, { useMemo } from "react";
import { useLocation } from "react-router-dom";
import "./PageTitle.css";

import Ovelha from "../../../assets/icons/ovelha1.png";

const PageTitle: React.FC = () => {
  const location = useLocation();

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
        return "Registrar Adoecimento";
      case "/dashboard/ovinos/doencas/doentes":
        return "Animais doentes";
      case "/dashboard/ovinos/medicamentos/criar":
        return "Cadastrar Medicamento";
      case "/dashboard/ovinos/medicamentos/gerenciar":
        return "Gerenciar Medicamentos";
      case "/dashboard/ovinos/aplicacoes/cadastrar/medicamento":
        return "Registrar aplicação de medicamento";
      case "/dashboard/ovinos/vacinas/criar":
        return "Cadastrar Vacina";
      case "/dashboard/ovinos/vacinas/gerenciar":
        return "Gerenciar Vacinas";
      case "/dashboard/ovinos/aplicacoes/cadastrar/vacina":
        return "Registrar aplicação de vacina";
      case "/dashboard/ovinos/vacinas/vacinacoes":
        return "Vacinações";
      case "/dashboard/ovinos/medicamentos/medicacoes":
        return "Medicações";
      case "/dashboard/ovinos/compra/criar":
        return "Registrar Compra";
      case "/dashboard/ovinos/compra/gerenciar":
        return "Gerenciar Compras";
      case "/dashboard/registros":
        return "Registros";
      case "/dashboard/ovinos/pesagens/criar":
        return "Registrar Pesagem";
      case "/dashboard/ovinos/pesagens/gerenciar":
        return "Gerenciar Pesagens";
      case "/dashboard/ovinos/fullinfo":
        return "Informações do Ovino";
      case "/dashboard/usuarios":
        return "Gerenciar Usuários";
    case "/dashboard/usuarios/cadastrar":
        return "Cadastrar Usuário";
      default:
        return "Dashboard";
    }
  }, [location.pathname]);

  return (
    <div className="pageTitle-dashboard flex">
      <ul className="flex">
        <li className="pageTitle-line flex">
          <img src={Ovelha} alt="ovelha" />
          <h2>{typeName}</h2>
        </li>
      </ul>
    </div>
  );
};

export default PageTitle;
