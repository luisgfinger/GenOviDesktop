import React from "react";
import EditIcon from "../../../assets/icons/pencil.png";
import RemoveIcon from "../../../assets/icons/trash.png";
import "./ActionButton.css";

interface ActionButtonsProps {
  onEdit?: () => void;
  onRemove?: () => void;
  showEdit?: boolean;
  showRemove?: boolean;
  size?: number;
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onRemove,
  showEdit = true,
  showRemove = true,
  size = 24,
  className = "",
}) => {
  return (
    <div className={`action-buttons ${className}`}>
      {showEdit && (
        <button
          type="button"
          onClick={onEdit}
          title="Editar"
          className="action-btn act-edit-btn"
        >
          <img
            src={EditIcon}
            alt="Editar"
            className="act-icon"
            style={{ width: size, height: size }}
          />
        </button>
      )}

      {showRemove && (
        <button
          type="button"
          onClick={onRemove}
          title="Remover"
          className="action-btn act-remove-btn"
        >
          <img
            src={RemoveIcon}
            alt="Remover"
            className="act-icon"
            style={{ width: size, height: size }}
          />
        </button>
      )}
    </div>
  );
};

export default ActionButtons;
