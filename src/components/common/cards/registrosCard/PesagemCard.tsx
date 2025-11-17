import React from "react";
import Button from "../../../common/buttons/Button";
import "./BaseCard.css";

import type { PesagemResponseDTO } from "../../../../api/dtos/pesagem/PesagemResponseDTO";

import { formatDate } from "../../../../utils/formatDate";
import { updateRegistroToggle } from "../../../../utils/updateRegistroToggle";
import { toast } from "react-toastify";

interface PesagemCardProps {
  pesagem: PesagemResponseDTO & {
    ovinoNome?: string;
    racaNome?: string;
  };
  confirmado: boolean;
  onView: () => void;
  onEdit?: () => void;
  onConfirm: (id: number) => void;
}

const PesagemCard: React.FC<PesagemCardProps> = ({
  pesagem,
  confirmado,
  onView,
  onEdit,
  onConfirm,
}) => {
  const handleToggleConfirmado = async () => {
    try {
      await updateRegistroToggle(pesagem.id, "isSugestao");
      if (onConfirm) onConfirm(pesagem.id);
    } catch (error) {
      console.error("Erro ao confirmar registro:", error);
      toast.error("Erro ao marcar como confirmado.");
    }
  };

  return (
    <div className="card">
      <span className="card-type aplicacao">
        <div className="card-header-info flex">
          <strong>Pesagem #{pesagem.id}</strong>

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
          <strong>Ovino</strong>
        </div>
        <div className="card-col-main">{pesagem.ovinoNome ?? "—"}</div>
        <div className="card-meta">
          FBB: {pesagem.ovino?.fbb ?? "—"} • RFID: {pesagem.ovino?.rfid ?? "—"}
        </div>
      </div>

      <div>
        <div className="card-meta">
          <strong>Peso:</strong> {pesagem.peso?.toFixed(2)} kg
          <br />
          <strong>Raça:</strong> {pesagem.racaNome ?? "—"}
          <br />
          <strong>Data:</strong> {formatDate(pesagem.dataPesagem, true)}
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

export default PesagemCard;
