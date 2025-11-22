import React from "react";
import "./DoencaCard.css";
import ActionButtons from "../../buttons/ActionButtons";

interface DoencaCardProps {
  id: number;
  nome: string;
  descricao: string;
  onEdit: (id: number) => void;
  onRemove: (id: number) => void;
}

const DoencaCard: React.FC<DoencaCardProps> = ({
  id,
  nome,
  descricao,
  onEdit,
  onRemove,
}) => {
  return (
    <ul className="doencaCard-container flex-column">
      <li className="flex doencaCard-header">
        <div className="flex-column">
          <h3>{nome}</h3>
        </div>
      </li>

      <li className="middle-column flex-column">
        <span className="flex-column">
          <p>{descricao || "—"}</p>
        </span>
      </li>

      <li className="doencaCard-buttons flex-column">
        <ActionButtons
          onEdit={() => onEdit(id)}
          onRemove={() => onRemove(id)}
        />
      </li>
    </ul>
  );
};

export default DoencaCard;
