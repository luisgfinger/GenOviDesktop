import React from "react";
import { useNavigate } from "react-router-dom";
import "./NovoRegistroMenu.css";
import Button from "../../common/buttons/Button";

interface NovoRegistroMenuProps {
  onClose: () => void;
}

const NovoRegistroMenu: React.FC<NovoRegistroMenuProps> = ({ onClose }) => {
  const navigate = useNavigate();

  const opcoes = [
    { label: "Vacinação", rota: "/dashboard/ovinos/aplicacoes/cadastrar/vacina" },
    { label: "Medicação", rota: "/dashboard/ovinos/aplicacoes/cadastrar/medicamento" },
    { label: "Reprodução", rota: "//dashboard/ovinos/reproducoes/criar" },
    { label: "Gestação", rota: "/dashboard/ovinos/gestacoes/criar" },
    { label: "Parto", rota: "/dashboard/ovinos/partos/criar" },
    { label: "Adoecimento", rota: "/dashboard/ovinos/doencas/adoecimento" },
    {label: "Pesagem", rota: "/dashboard/ovinos/pesagem/criar"},
  ];

  const handleSelect = (rota: string) => {
    navigate(rota);
    onClose();
  };

  return (
    <div className="novo-registro-overlay">
      <div className="novo-registro-menu">
        <h3>Escolha o tipo de registro</h3>
        <div className="novo-registro-opcoes">
          {opcoes.map((op) => (
            <Button
              key={op.label}
              type="button"
              variant="cardPrimary"
              onClick={() => handleSelect(op.rota)}
            >
              {op.label}
            </Button>
          ))}
        </div>
        <Button type="button" variant="cardSecondary" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </div>
  );
};

export default NovoRegistroMenu;
