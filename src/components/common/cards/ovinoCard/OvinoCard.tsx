import React from "react";
import "./OvinoCard.css";
import Ovino from "../../../../assets/images/ovinoImagem.png";
import Button from "../../buttons/Button";
import { formatEnum } from "../../../../utils/formatEnum";

interface OvinoCardProps {
  imagem?: string;
  nome: string;
  sexo: string;
  fbb: string;
  raca: string;
  pai?: { id: number; nome: string } | undefined;
  mae?: { id: number; nome: string } | undefined;
  pureza: string;
}

const OvinoCard: React.FC<OvinoCardProps> = ({
  imagem = Ovino,
  nome,
  sexo,
  fbb,
  raca,
  pai,
  mae,
  pureza,
}) => {
  return (
    <ul className="ovinoCard-container flex-column">
      <li className="flex">
        <img src={imagem} alt={nome} />
        <div className="flex-column">
          <h3>{nome}</h3>
          <p>{sexo}</p>
        </div>
      </li>
      <li className="flex-column">
        <span className="flex">
          <h3>FBB:</h3>
          <p>{fbb}</p>
        </span>
        <span className="flex">
          <h3>RAÇA:</h3>
          <p>{formatEnum(raca)}</p>
        </span>
        <span className="flex">
          <h3>PAI:</h3>
          <p>{pai ? pai.nome : "Não informado"}</p>
        </span>
        <span className="flex">
          <h3>MÃE:</h3>
          <p>{mae ? mae.nome : "Não informado"}</p>
        </span>
        <span className="flex">
          <h3>PUREZA:</h3>
          <p>{formatEnum(pureza)}</p>
        </span>
      </li>
      <li className="ovinoCard-buttons flex-column">
        <Button variant="cardPrimary">Ver mais</Button>
        <Button variant="cardSecondary">Abrir registros</Button>
      </li>
    </ul>
  );
};

export default OvinoCard;
