import React from "react";
import Button from "../../../common/buttons/Button";
import "./BaseCard.css";
import { formatDate } from "../../../../utils/formatDate";
import type { ReproducaoResponseDTO } from "../../../../api/dtos/reproducao/ReproducaoResponseDTO";
import { updateRegistroToggle } from "../../../../utils/updateRegistroToggle";
import { toast } from "react-toastify";

interface ReproducaoCardProps {
  reproducao: ReproducaoResponseDTO;
  onView: () => void;
  onEdit?: () => void;
  confirmado: boolean;
}

const ReproducaoCard: React.FC<ReproducaoCardProps> = ({
  reproducao,
  onView,
  onEdit,
  confirmado = false,
}) => {
  const handleToggleConfirmado = async () => {
        try {
          await updateRegistroToggle(reproducao.id, "isSugestao");
          toast.success("Registro atualizado como confirmado!");
        } catch (error) {
          console.error("Erro ao confirmar registro:", error);
          toast.error("Erro ao marcar como confirmado.");
        }
      };
  return (
    <div className="card">
      <span className="card-type reproducao">
        <div className="card-header-info flex">
          <strong>Reprodução(#{reproducao.id})</strong>
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
          <strong>Carneiro (Macho)</strong>
        </div>
        <div className="card-col-main">{reproducao.carneiro?.nome ?? "—"}</div>
        <div className="card-meta">
          RFID: {reproducao.carneiro?.rfid ?? "—"}
        </div>
      </div>

      <div>
        <div className="card-col-title">
          <strong>Ovelha (Fêmea)</strong>
        </div>
        <div className="card-col-main">{reproducao.ovelha?.nome ?? "—"}</div>
        <div className="card-meta">RFID: {reproducao.ovelha?.rfid ?? "—"}</div>
      </div>

      <div>
        <div className="card-col-title">
          <strong>Detalhes</strong>
        </div>
        <div className="card-meta">
          <strong>Tipo:</strong> {reproducao.enumReproducao ?? "—"}
          <br />
          <strong>Data:</strong> {formatDate(reproducao.dataReproducao, true)}
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

export default ReproducaoCard;
