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
import Compra from "../../../assets/icons/buy.png";

import "./DashboardMenu.css";

const DashboardMenu: React.FC = () => {
  const ovinosCardOptions = [
    {
      images: [{ src: Add, alt: "add" }],
      text: "Cadastrar Ovinos",
      href: "/dashboard/ovinos/cadastrar",
    },
    {
      images: [{ src: Manage, alt: "manage" }],
      text: "Gerenciar Ovinos",
      href: "/dashboard/ovinos/gerenciar",
    },
  ];

  const ovinosCardOptions2 = [
    { images: [{ src: Vacina, alt: "vacina" }], text: "Vacinas", href: "/", childrenCount: 4 },
    { images: [{ src: Medicamento, alt: "medicamento" }], text: "Medicamentos", href: "/", childrenCount: 4 },
    { images: [{ src: Doenca, alt: "doença" }], text: "Doenças", href: "/", childrenCount: 3 },
    { images: [{ src: Reproducao, alt: "reproducao" }], text: "Reproduções", href: "/", childrenCount: 2 },
    { images: [{ src: Gestacao, alt: "gestacao" }], text: "Gestações", href: "/", childrenCount: 2 },
    { images: [{ src: Amamentacao, alt: "amamentacao" }], text: "Partos", href: "/", childrenCount: 2 },
  ];

  const ovinoChildrenOptions = [
    { text: "Registrar vacinação", href: "/dashboard/ovinos/aplicacoes/cadastrar/vacina" },
    { text: "Gerenciar vacinanões", href: "/dashboard/ovinos/vacinas/vacinacoes" },
    { text: "Cadastrar vacina", href: "/dashboard/ovinos/vacinas/criar" },
    { text: "Gerenciar vacinas", href: "/dashboard/ovinos/vacinas/gerenciar" },

    { text: "Registrar aplicação", href: "/dashboard/ovinos/aplicacoes/cadastrar/medicamento" },
    { text: "Gerenciar aplicações", href: "/dashboard/ovinos/medicamentos/medicacoes" },
    { text: "Cadastrar medicamento", href: "/dashboard/ovinos/medicamentos/criar" },
    { text: "Gerenciar medicamentos", href: "/dashboard/ovinos/medicamentos/gerenciar" },

    { text: "Registrar adoecimento", href: "/dashboard/ovinos/doencas/adoecimento" },
    { text: "Animais doentes", href: "/dashboard/ovinos/doencas/doentes" },
    { text: "Gerenciar doenças", href: "/dashboard/ovinos/doencas/gerenciar" },

    { text: "Registrar reprodução", href: "/dashboard/ovinos/reproducoes/criar" },
    { text: "Gerenciar reproduções", href: "/dashboard/ovinos/reproducoes/gerenciar" },

    { text: "Registrar gestação", href: "/dashboard/ovinos/gestacoes/criar" },
    { text: "Gerenciar gestações", href: "/dashboard/ovinos/gestacoes/gerenciar" },

    { text: "Registrar parto", href: "/dashboard/ovinos/partos/criar" },
    { text: "Gerenciar partos", href: "/dashboard/ovinos/partos/gerenciar" },
  ];

  let start = 0;

  return (
    <ul className="dashboardMenu-content flex-column">
      <li>
        <h3>Ovinos</h3>
      </li>

      <li className="dashboardMenu-content-optionsLine dashboardMenu-content-optionsLine-line1 flex">
        {ovinosCardOptions.map((option, index) => (
          <OptionCard
            key={index}
            images={option.images}
            text={option.text}
            href={option.href}
          />
        ))}
      </li>
      <li>
        <h3>Saúde e Reprodução</h3>
      </li>

      <li className="dashboardMenu-content-optionsLine flex">
        {ovinosCardOptions2.map((option, index) => {
          const end = start + option.childrenCount;
          const childrenForCard = ovinoChildrenOptions.slice(start, end);
          start = end;

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
      <li>
        <h3>Entrada e Saída</h3>
      </li>

      <li className="dashboardMenu-content-optionsLine flex">
        <OptionCard
          images={[{ src: Compra, alt: "compra" }]}
          text="Compra"
          href="/dashboard/ovinos/compra/gerenciar"
          childrenOptions={[
            { text: "Registrar compra", href: "/dashboard/ovinos/compra/criar" },
            { text: "Gerenciar compras", href: "/dashboard/ovinos/compra/gerenciar" },
          ]}
        />
      </li>
    </ul>
  );
};

export default DashboardMenu;
