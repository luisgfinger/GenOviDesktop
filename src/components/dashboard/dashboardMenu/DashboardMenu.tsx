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
import Pesagem from "../../../assets/icons/balance.png";

import "./DashboardMenu.css";
import { useIsAdmin } from "../../../api/hooks/useIsAdmin";

const DashboardMenu: React.FC = () => {
  const isAdmin = useIsAdmin();

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
    { images: [{ src: Vacina, alt: "vacina" }], text: "Vacinas", href: "/" },
    {
      images: [{ src: Medicamento, alt: "medicamento" }],
      text: "Medicamentos",
      href: "/",
    },
    { images: [{ src: Doenca, alt: "doença" }], text: "Doenças", href: "/" },
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
    {
      images: [{ src: Pesagem, alt: "pesagem" }],
      text: "Pesagens",
      href: "/dashboard/ovinos/pesagens/gerenciar",
    },
  ];

  const ovinoChildrenOptions = [
    {
      group: 1,
      text: "Registrar vacinação",
      href: "/dashboard/ovinos/aplicacoes/cadastrar/vacina",
    },
    {
      group: 1,
      text: "Gerenciar vacinanões",
      href: "/dashboard/ovinos/vacinas/vacinacoes",
    },
    {
      group: 1,
      text: "Cadastrar vacina",
      href: "/dashboard/ovinos/vacinas/criar",
      adminOnly: true,
    },
    {
      group: 1,
      text: "Gerenciar vacinas",
      href: "/dashboard/ovinos/vacinas/gerenciar",
    },

    {
      group: 2,
      text: "Registrar aplicação",
      href: "/dashboard/ovinos/aplicacoes/cadastrar/medicamento",
    },
    {
      group: 2,
      text: "Gerenciar aplicações",
      href: "/dashboard/ovinos/medicamentos/medicacoes",
    },
    {
      group: 2,
      text: "Cadastrar medicamento",
      href: "/dashboard/ovinos/medicamentos/criar",
      adminOnly: true,
    },
    {
      group: 2,
      text: "Gerenciar medicamentos",
      href: "/dashboard/ovinos/medicamentos/gerenciar",
    },

    {
      group: 3,
      text: "Registrar adoecimento",
      href: "/dashboard/ovinos/doencas/adoecimento",
    },
    {
      group: 3,
      text: "Animais doentes",
      href: "/dashboard/ovinos/doencas/doentes",
    },
    {
      group: 3,
      text: "Gerenciar doenças",
      href: "/dashboard/ovinos/doencas/gerenciar",
    },

    {
      group: 4,
      text: "Registrar reprodução",
      href: "/dashboard/ovinos/reproducoes/criar",
    },
    {
      group: 4,
      text: "Gerenciar reproduções",
      href: "/dashboard/ovinos/reproducoes/gerenciar",
    },

    {
      group: 5,
      text: "Registrar gestação",
      href: "/dashboard/ovinos/gestacoes/criar",
    },
    {
      group: 5,
      text: "Gerenciar gestações",
      href: "/dashboard/ovinos/gestacoes/gerenciar",
    },

    {
      group: 6,
      text: "Registrar parto",
      href: "/dashboard/ovinos/partos/criar",
    },
    {
      group: 6,
      text: "Gerenciar partos",
      href: "/dashboard/ovinos/partos/gerenciar",
    },

    {
      group: 7,
      text: "Registrar pesagem",
      href: "/dashboard/ovinos/pesagens/criar",
    },
    {
      group: 7,
      text: "Gerenciar pesagens",
      href: "/dashboard/ovinos/pesagens/gerenciar",
    },
  ];

  const filteredChildrenOptions = ovinoChildrenOptions.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

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
          const childrenForCard = filteredChildrenOptions.filter(
            (child) => child.group === index + 1
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

      {isAdmin && (
        <ul>
          <li>
            <h3>Entrada e Saída</h3>
          </li>

          <li className="dashboardMenu-content-optionsLine flex">
            <OptionCard
              images={[{ src: Compra, alt: "compra" }]}
              text="Compra"
              href="/dashboard/ovinos/compra/gerenciar"
              childrenOptions={[
                {
                  text: "Registrar compra",
                  href: "/dashboard/ovinos/compra/criar",
                },
                {
                  text: "Gerenciar compras",
                  href: "/dashboard/ovinos/compra/gerenciar",
                },
              ]}
            />
          </li>
        </ul>
      )}
    </ul>
  );
};

export default DashboardMenu;
