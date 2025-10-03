import React from "react";
import "./MedicamentoCard.css";
import Button from "../../buttons/Button";
import type { Doenca } from "../../../../api/models/doenca/DoencaModel";

interface MedicamentoCardProps {
  nome: string;
  fabricante: string;
  quantidadeDoses: number;
  intervaloDoses: number;
  isVacina: boolean;
  doencas: Doenca[];
}

const MedicamentoCard: React.FC<MedicamentoCardProps> = ({
  nome,
  fabricante,
  quantidadeDoses,
  intervaloDoses,
  isVacina,
  doencas,
}) => {
  return (
    <ul className="medicamentoCard-container flex-column">
      <li className="flex">
        <div className="flex-column">
          <h3>{nome}</h3>
          <p className="fabricante">Fabricante: {fabricante}</p>
        </div>
      </li>

      <li className="middle-column flex-column">
        <span className="flex-column">
          <h3>Informações:</h3>
          <p>Doses: {quantidadeDoses}</p>
          <p>Intervalo: {intervaloDoses} dias</p>
          <p>Tipo: {isVacina ? "Vacina" : "Medicamento comum"}</p>
        </span>

        {doencas?.length > 0 && (
          <span className="flex-column doencas-list">
            <h3>Trata:</h3>
            <ul>
              {doencas.map((d) => (
                <li key={d.id}>{d.nome}</li>
              ))}
            </ul>
          </span>
        )}
      </li>

      <li className="medicamentoCard-buttons flex-column">
        <Button variant="cardPrimary">Ver mais</Button>
        <Button variant="cardSecondary">Histórico de uso</Button>
      </li>
    </ul>
  );
};

export default MedicamentoCard;
