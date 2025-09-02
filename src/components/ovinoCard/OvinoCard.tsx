import React from "react";
import "./OvinoCard.css";
import "../../styles/Button.css";

import Ovino from "../../assets/images/ovinoImagem.png";

interface OvinoCardProps {
  imagem?: string;
  nome: string;
  sexo: string;
  fbb: string;
  raca: string;
  pai: string;
  mae: string;
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
          <p>{raca}</p>
        </span>
        <span className="flex">
          <h3>PAI:</h3>
          <p>{pai}</p>
        </span>
        <span className="flex">
          <h3>MÃE:</h3>
          <p>{mae}</p>
        </span>
        <span className="flex">
          <h3>PUREZA:</h3>
          <p>{pureza}</p>
        </span>
      </li>
      <li className="ovinoCard-buttons flex-column">
        <button className="card-button card-primaryButton">
          Ver mais
        </button>
        <button className="card-button card-secondaryButton">
          Abrir registros
        </button>
      </li>
    </ul>
  );
};

export default OvinoCard;