import React from "react";
import "./MedicamentoCard.css";
import ActionButtons from "../../buttons/ActionButtons";
import type { Doenca } from "../../../../api/models/doenca/DoencaModel";

interface MedicamentoCardProps {
  id: number;
  nome: string;
  fabricante: string;
  quantidadeDoses: number;
  intervaloDoses: number;
  isVacina: boolean;
  doencas: Doenca[];
  onEdit: (id: number) => void;
  onRemove: (id: number) => void;
}

const MedicamentoCard: React.FC<MedicamentoCardProps> = ({
  id,
  nome,
  fabricante,
  quantidadeDoses,
  intervaloDoses,
  isVacina,
  doencas,
  onEdit,
  onRemove,
}) => {
  return (
    <ul className="medicamentoCard-container flex-column">
      <li className="flex medicamentoCard-header">
        <div className="flex-column">
          <h3>{nome}</h3>
          <p className="fabricante">Fabricante: {fabricante}</p>
        </div>

      
      </li>
      <li className="middle-column flex-column">
        <span className="flex-column">
          <strong>Informações:</strong>
          <p>Doses: {quantidadeDoses}</p>
          <p>Intervalo: {intervaloDoses} dias</p>
          <p>Tipo: {isVacina ? "Vacina" : "Medicamento comum"}</p>
        </span>

        {doencas?.length > 0 && (
          <span className="flex-column doencas-list">
            <strong>Trata:</strong>
            <ul>
              {doencas.map((d) => (
                <li key={d.id}>{d.nome}</li>
              ))}
            </ul>
          </span>
        )}
      </li>

      <li className="medicamentoCard-buttons flex-column">
       <ActionButtons
          onEdit={() => onEdit(id)}
          onRemove={() => onRemove(id)}
        />
      </li>
    </ul>
  );
};

export default MedicamentoCard;
