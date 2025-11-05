import React from "react";
import Button from "../../../common/buttons/Button";
import "./BaseCard.css";
import { formatDate } from "../../../../utils/formatDate";
import type { GestacaoResponseDTO } from "../../../../api/dtos/gestacao/GestacaoResponseDTO";
import { updateRegistroToggle } from "../../../../utils/updateRegistroToggle";
import { toast } from "react-toastify";

interface GestacaoCardProps {
  gestacao: GestacaoResponseDTO;
  onView: () => void;
  onEdit?: () => void;
  confirmado: boolean;
  onConfirm: (id: number) => void;
}

const GestacaoCard: React.FC<GestacaoCardProps> = ({
  gestacao,
  onView,
  onEdit,
  confirmado = false,
  onConfirm
}) => {
     const handleToggleConfirmado = async () => {
        try {
          await updateRegistroToggle(gestacao.id, "isSugestao");
            if (onConfirm) onConfirm(gestacao.id);
        } catch (error) {
          console.error("Erro ao confirmar registro:", error);
          toast.error("Erro ao marcar como confirmado.");
        }
      };
  return (
    <div className="card">
      <span className="card-type gestacao">
        <div className="card-header-info flex">
          <strong>Gestação(#{gestacao.id})</strong>
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
        <div className="card-col-main">{gestacao.ovelhaMae?.nome ?? "—"}</div>
        <div className="card-meta">RFID: {gestacao.ovelhaMae?.rfid ?? "—"}</div>
      </div>
      <div>
        <div className="card-col-title">
          <strong>Carneiro (pai)</strong>
        </div>
        <div className="card-col-main">{gestacao.ovelhaPai?.nome ?? "—"}</div>
        <div className="card-meta">RFID: {gestacao.ovelhaPai?.rfid ?? "—"}</div>
      </div>
      <div>
        <div className="card-col-title">
          <strong>Início</strong>
        </div>
        <div className="card-meta">
          {formatDate(gestacao.dataGestacao, true)}
        </div>
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

export default GestacaoCard;
