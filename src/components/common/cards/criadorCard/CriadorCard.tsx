import React from "react";
import "./CriadorCard.css";
import Ovino from "../../../../assets/images/ovinoImagem.png";
import Button from "../../buttons/Button";

interface CriadorCardProps {
  imagem?: string;
  cpfCnpj: string;
  endereco: string;
  nome: string;
  telefone: string;
}

const CriadorCard: React.FC<CriadorCardProps> = ({
  imagem = Ovino,
  cpfCnpj,
  endereco,
  nome,
  telefone,
}) => {
  return (
    <ul className="criadorCard-container flex-column">
      <li className="flex">
        <img src={imagem} alt={nome} />
        <div className="flex-column">
          <h3>{nome}</h3>
        </div>
      </li>
      <li className="flex-column">
        <span className="flex">
          <h3>CPF/CNPJ:</h3>
          <p>{cpfCnpj}</p>
        </span>
        <span className="flex">
          <h3>Endereço:</h3>
          <p>{endereco}</p>
        </span>
        <span className="flex">
          <h3>Telefone:</h3>
          <p>{telefone}</p>
        </span>
      </li>
      <li className="criadorCard-buttons flex-column">
        <Button variant="cardPrimary">Ver mais</Button>
        <Button variant="cardSecondary">Abrir registros</Button>
      </li>
    </ul>
  );
};

export default CriadorCard;
