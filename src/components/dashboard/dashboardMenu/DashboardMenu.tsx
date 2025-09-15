import React from "react";
import OptionCard from "../../common/cards/optionCard/OptionCard";
import Add from "../../../assets/icons/add.png";
import Manage from "../../../assets/icons/manage.png";
import Lote from "../../../assets/icons/lote.png";
import Criar from "../../../assets/icons/criarLote.png";
import Amamentacao from "../../../assets/icons/amamentacao.png";
import Vacina from "../../../assets/icons/vacinas.png";
import Medicamento from "../../../assets/icons/medicamentos.png";
import Doenca from "../../../assets/icons/doencas.png";
import Gestacao from "../../../assets/icons/gestacao.png";

import "./DashboardMenu.css";

interface DashboardMenuProps {
  location: string;
}

const DashboardMenu: React.FC<DashboardMenuProps> = ({ location }) => {
  const ovinosCardOptions = [
    {
      images: [{ src: Add, alt: "add" }],
      text: "Cadastrar Ovinos",
      href: "/dashboard/ovinos/cadastrar",
    },
    {
      images: [{ src: Manage, alt: "add" }],
      text: "Gerenciar Ovinos",
      href: "/dashboard/ovinos/gerenciar",
    },
    {
      images: [{ src: Criar, alt: "add" }],
      text: "Criar lotes",
      href: "/",
    },
    {
      images: [{ src: Lote, alt: "add" }],
      text: "Gerenciar lotes",
      href: "/",
    },
  ];

  const ovinosCardOptions2 = [
    {
      images: [{ src: Amamentacao, alt: "amamentacao" }],
      text: "Amamentação",
      href: "/",
    },
    {
      images: [{ src: Vacina, alt: "vacina" }],
      text: "Vacinas",
      href: "/",
    },
    {
      images: [{ src: Medicamento, alt: "medicamento" }],
      text: "Medicamentos",
      href: "/",
    },
    {
      images: [{ src: Doenca, alt: "doença" }],
      text: "Doenças",
      href: "/",
    },
    {
      images: [{ src: Gestacao, alt: "gestacao" }],
      text: "Gestações",
      href: "/",
    },
  ];

  const funcionariosCardOptions = [
    {
      images: [{ src: Add, alt: "add" }],
      text: "Cadastrar Funcionario",
      href: "/dashboard/funcionarios/cadastrar",
    },
    {
      images: [{ src: Manage, alt: "add" }],
      text: "Gerenciar Funcionario",
      href: "/dashboard/funcionarios/gerenciar",
    },
  ];

  return (
    <ul className="dashboardMenu-content flex-column">
      <li>
        <h3>{location == "ovino"? "Ovinos" : "Funcionarios"}</h3>
      </li>
      <li className="dashboardMenu-content-optionsLine flex">
        {location === "ovino"
          ? ovinosCardOptions.map((option, index) => (
              <OptionCard
                key={index}
                images={option.images}
                text={option.text}
                href={option.href}
              />
            ))
          : funcionariosCardOptions.map((option, index) => (
              <OptionCard
                key={index}
                images={option.images}
                text={option.text}
                href={option.href}
              />
            ))}
      </li>

      {location === "ovino" && (
        <>
          <li>
            <h3>Saúde</h3>
          </li>
          <li className="dashboardMenu-content-optionsLine flex">
            {ovinosCardOptions2.map((option, index) => (
              <OptionCard
                key={index}
                images={option.images}
                text={option.text}
                href={option.href}
              />
            ))}
          </li>
        </>
      )}
    </ul>
  );
};
export default DashboardMenu;
