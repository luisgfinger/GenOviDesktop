import React from "react";
import Button from "../../../common/buttons/Button";
import "./BaseCard.css";

import { formatDate } from "../../../../utils/formatDate";
import type { PartoResponseDTO } from "../../../../api/dtos/parto/PartoResponseDTO";
import { updateRegistroToggle } from "../../../../utils/updateRegistroToggle";
import { toast } from "react-toastify";

interface PartoCardProps {
  parto: PartoResponseDTO;
  onView: () => void;
  onEdit?: () => void;
  confirmado: boolean;
}

const PartoCard: React.FC<PartoCardProps> = ({
  parto,
  onView,
  onEdit,
  confirmado = false,
}) => {
   const handleToggleConfirmado = async () => {
      try {
        await updateRegistroToggle(parto.id, "isSugestao");
        toast.success("Registro atualizado como confirmado!");
      } catch (error) {
        console.error("Erro ao confirmar registro:", error);
        toast.error("Erro ao marcar como confirmado.");
      }
    };
  return (
    <div className="card">
      <span className="card-type">
        <div className="card-header-info flex">
          <strong>Parto</strong>
          <span>
            <strong>Responsável:</strong>{" "}
            {localStorage.getItem("funcionarioNome") ?? "—"}
          </span>
          <span>
            <strong>Confirmado:</strong> {confirmado ? "Sim" : "Não"}
          </span>
        </div>
      </span>
      <div>
        <div className="card-col-title">
          <strong>Ovelha (mãe)</strong>
        </div>
        <div className="card-col-main">{parto.mae?.nome ?? "—"}</div>
        <div className="card-meta">
          FBB: {parto.mae?.fbb ?? "—"} • RFID: {parto.mae?.rfid ?? "—"}
        </div>
      </div>
      <div>
        <div className="card-col-title">
          <strong>Carneiro (pai)</strong>
        </div>
        <div className="card-col-main">{parto.mae?.nome ?? "—"}</div>
        <div className="card-meta">
          FBB: {parto.mae?.fbb ?? "—"} • RFID: {parto.mae?.rfid ?? "—"}
        </div>
      </div>
      <div>
        <div className="card-col-title">
          <strong>Data do Parto</strong>
        </div>
        <div className="card-meta">{formatDate(parto.dataParto, true)}</div>
      </div>
      <div className="card-actions">
        <Button variant="cardSecondary" onClick={onView}>
          Ver mais
        </Button>
        {!confirmado && (
          <Button variant="cardPrimary" onClick={handleToggleConfirmado}>
            Confirmar
          </Button>
        )}
      </div>
    </div>
  );
};

export default PartoCard;
