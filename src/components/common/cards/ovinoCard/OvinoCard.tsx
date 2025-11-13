import React from "react";
import "./OvinoCard.css";
import OvinoDefault from "../../../../assets/images/ovinoImagem.png";
import Button from "../../buttons/Button";
import { formatEnum } from "../../../../utils/formatEnum";
import type { Ovino } from "../../../../api/models/ovino/OvinoModel";
import { useNavigate } from "react-router-dom";

interface OvinoCardProps {
  ovino: Ovino;
  imagem?: string;
}

const OvinoCard: React.FC<OvinoCardProps> = ({
  ovino,
  imagem = OvinoDefault,
}) => {
  const navigate = useNavigate();

  return (
    <ul className="ovinoCard-container flex-column">
      <li className="flex">
        <img src={imagem} alt={ovino.nome} />
        <div className="flex-column">
          <h3>{ovino.nome}</h3>
          <p>{formatEnum(ovino.sexo)}</p>
        </div>
      </li>
      <li className="flex-column">
        <span className="flex">
          <h3>FBB:</h3>
          <p>{ovino.fbb}</p>
        </span>
        <span className="flex">
          <h3>RAÇA:</h3>
          <p>{formatEnum(ovino.raca)}</p>
        </span>
        <span className="flex">
          <h3>PAI:</h3>
          <p>{ovino.ovinoPai?.nome ?? "Não informado"}</p>
        </span>
        <span className="flex">
          <h3>MÃE:</h3>
          <p>{ovino.ovinoMae?.nome ?? "Não informado"}</p>
        </span>
        <span className="flex">
          <h3>PUREZA:</h3>
          <p>{formatEnum(ovino.grauPureza)}</p>
        </span>
      </li>
      <li className="ovinoCard-buttons flex-column">
        <Button
          variant="cardPrimary"
          onClick={() =>
            navigate(`/dashboard/ovinos/fullinfo/${ovino.rfid}`, {
              state: { ovino },
            })
          }
        >
          Ver mais
        </Button>
        <Button variant="cardSecondary">Abrir registros</Button>
      </li>
    </ul>
  );
};

export default OvinoCard;
