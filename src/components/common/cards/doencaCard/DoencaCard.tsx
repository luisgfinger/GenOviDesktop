import React from "react";
import "./DoencaCard.css";
import Button from "../../buttons/Button";

interface DoencaCardProps {
  nome: string;
  descricao: string;
}

const DoencaCard: React.FC<DoencaCardProps> = ({
  nome,
  descricao,
}) => {

  return (
    <ul className="doencaCard-container flex-column">
      <li className="flex">
        <div className="flex-column">
          <h3>{nome}</h3>
        </div>
      </li>
      <li className="middle-column flex-column">
         <span className="flex-column">
          <h3>Descrição:</h3>
          <p>{descricao}</p>
        </span>
      </li>
      <li className="doencaCard-buttons flex-column">
        <Button variant="cardPrimary">Ver mais</Button>
        <Button variant="cardSecondary">Abrir registros</Button>
      </li>
    </ul>
  );
};

export default DoencaCard;
