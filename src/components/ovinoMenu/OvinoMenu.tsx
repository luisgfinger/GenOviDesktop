import React from "react";
import OptionCard from "../optionCard/OptionCard";
import Add from "../../assets/icons/add.png";
import Manage from "../../assets/icons/manage.png";
import Lote from "../../assets/icons/lote.png";
import Criar from "../../assets/icons/criarLote.png";
import Amamentacao from "../../assets/icons/amamentacao.png";
import Vacina from "../../assets/icons/vacinas.png";
import Medicamento from "../../assets/icons/medicamentos.png";
import Doenca from "../../assets/icons/doencas.png";
import Gestacao from "../../assets/icons/gestacao.png";

import "./OvinoMenu.css"

const OvinoMenu: React.FC = () => {
  const optionCardOptions = [
    {
      images: [{ src: Add, alt: "add" }],
      text: "Cadastrar Ovinos",
      href: "/",
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

  const optionCardOptions2 = [
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

  return (
    <ul className="ovinoMenu-content flex-column">
      <li>
        <h3>Ovinos</h3>
      </li>
      <li className="ovinoMenu-content-optionsLine flex">
        {optionCardOptions.map((option, index) => (
          <OptionCard
            key={index}
            images={option.images}
            text={option.text}
            href={option.href}
          />
        ))}
      </li>
      <li>
        <h3>Saúde</h3>
      </li>
      <li className="ovinoMenu-content-optionsLine flex">
        {optionCardOptions2.map((option, index) => (
          <OptionCard
            key={index}
            images={option.images}
            text={option.text}
            href={option.href}
          />
        ))}
      </li>
    </ul>
  );
};
export default OvinoMenu;
