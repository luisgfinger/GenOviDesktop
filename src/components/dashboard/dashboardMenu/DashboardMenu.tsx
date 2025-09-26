import React from "react";
import OptionCard from "../../common/cards/optionCard/OptionCard";
import Add from "../../../assets/icons/add.png";
import Manage from "../../../assets/icons/manage.png";
import Amamentacao from "../../../assets/icons/amamentacao.png";
import Vacina from "../../../assets/icons/vacinas.png";
import Medicamento from "../../../assets/icons/medicamentos.png";
import Doenca from "../../../assets/icons/doencas.png";
import Gestacao from "../../../assets/icons/gestacao.png";
import Reproducao from "../../../assets/icons/reproducao.png";

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
  ];

  const ovinosCardOptions2 = [
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
      images: [{ src: Reproducao, alt: "reproducao" }],
      text: "Reproduções",
      href: "/",
    },
    {
      images: [{ src: Gestacao, alt: "gestacao" }],
      text: "Gestações",
      href: "/",
    },
    {
      images: [{ src: Amamentacao, alt: "amamentacao" }],
      text: "Partos",
      href: "/",
    },
  ];

  const ovinoChildrenOptions = [
    { text: "Registrar vacinação", href: "#" },
    { text: "Cadastrar vacina", href: "#" },
    {text: "Mais opções", href: "#"},

    { text: "Registrar medicação", href: "#" },
    { text: "Cadastrar medicamento", href: "#" },
    {text: "Mais opções", href: "#"},

    {text: "Registrar adoecimento", href: "#"},
    {text: "Cadastrar doença", href: "#"},
    {text: "Mais opções", href: "#"},

    {text: "Registrar reprodução", href: "/dashboard/ovinos/reproducoes/criar"},
    {text: "Gerenciar reproduções", href: "/dashboard/ovinos/reproducoes/gerenciar"},
    {text: "Mais opções", href: "#"},

    {text: "Registrar gestação", href: "#"},
    {text: "Gerenciar gestações", href: "#"},
    {text: "Mais opções", href: "#"},

    {text: "Registrar parto", href: "#"},
    {text: "Gerenciar partos", href: "#"},
    {text: "Mais opções", href: "#"},


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
        <h3>{location == "ovino" ? "Ovinos" : "Funcionarios"}</h3>
      </li>
      <li className="dashboardMenu-content-optionsLine dashboardMenu-content-optionsLine-line1 flex">
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
            {ovinosCardOptions2.map((option, index) => {
              const childrenForCard = ovinoChildrenOptions.slice(
                index * 3,
                index * 3 + 3
              );

              return (
                <OptionCard
                  key={index}
                  images={option.images}
                  text={option.text}
                  href={option.href}
                  childrenOptions={childrenForCard}
                />
              );
            })}
          </li>
        </>
      )}
    </ul>
  );
};
export default DashboardMenu;
