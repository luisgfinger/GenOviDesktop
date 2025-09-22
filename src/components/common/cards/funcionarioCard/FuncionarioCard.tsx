import React from "react";
import "./FuncionarioCard.css";
import Button from "../../buttons/Button";

interface FuncionarioCardProps {
  nome: string;
  endereco: string;
  telefone: string;
  dataAdmissao: string;
  cpfCnpj: string;
}

const FuncionarioCard: React.FC<FuncionarioCardProps> = ({
  nome,
  endereco,
  telefone,
  dataAdmissao,
  cpfCnpj,
}) => {

  return (
    <ul className="funcionarioCard-container flex-column">
      <li className="flex">
        <div className="flex-column">
          <h3>{nome}</h3>
        </div>
      </li>
      <li className="middle-column flex-column">
         <span className="flex">
          <h3>Endereço:</h3>
          <p>{endereco}</p>
        </span>
         <span className="flex">
          <h3>Telefone:</h3>
          <p>{telefone}</p>
        </span>
        <span className="flex">
          <h3>CPF/CNPJ:</h3>
          <p>{cpfCnpj}</p>
        </span>
        <span className="flex">
          <h3>Data de admissão:</h3>
          <p>{dataAdmissao}</p>
        </span>
      </li>
      <li className="funcionarioCard-buttons flex-column">
        <Button variant="cardPrimary">Ver mais</Button>
        <Button variant="cardSecondary">Abrir registros</Button>
      </li>
    </ul>
  );
};

export default FuncionarioCard;
