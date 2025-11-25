import React from "react";
import Button from "../../../common/buttons/Button";
import "./BaseCard.css";
import { formatDate } from "../../../../utils/formatDate";
import type { ReproducaoResponseDTO } from "../../../../api/dtos/reproducao/ReproducaoResponseDTO";

interface ReproducaoCardProps {
  reproducao: ReproducaoResponseDTO;
  onView: () => void;
  onEdit?: () => void;
  confirmado: boolean;
  onConfirm: () => void;
  responsavel?: string;
}

const ReproducaoCard: React.FC<ReproducaoCardProps> = ({
  reproducao,
  onView,
  onEdit,
  confirmado = false,
  onConfirm,
  responsavel,
}) => {
  return (
    <div className="card">
      <span className="card-type reproducao">
        <div className="card-header-info flex">
          <strong>Reprodução (#{reproducao.id})</strong>

          <span>
            <strong>Responsável:</strong>{" "}
            {responsavel ?? "—"}
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
        <div className="card-col-main">
          {reproducao.carneiro?.nome ?? "—"}
        </div>
        <div className="card-meta">
          RFID: {reproducao.carneiro?.rfid ?? "—"}
        </div>
      </div>
      <div>
        <div className="card-col-title">
          <strong>Ovelha (Fêmea)</strong>
        </div>
        <div className="card-col-main">
          {reproducao.ovelha?.nome ?? "—"}
        </div>
        <div className="card-meta">
          RFID: {reproducao.ovelha?.rfid ?? "—"}
        </div>
      </div>
      <div>
        <div className="card-col-title">
          <strong>Detalhes</strong>
        </div>
        <div className="card-meta">
          <strong>Tipo:</strong> {reproducao.enumReproducao ?? "—"}
          <br />
          <strong>Data:</strong>{" "}
          {formatDate(reproducao.dataReproducao, true)}
        </div>
      </div>
      <div className="card-actions">
        <Button variant="cardSecondary" onClick={onView}>
          Ver mais
        </Button>

        {!confirmado && (
          <Button variant="cardPrimary" onClick={onConfirm}>
            Confirmar
          </Button>
        )}

        {onEdit && (
          <Button variant="cardSecondary" onClick={onEdit}>
            Editar
          </Button>
        )}
      </div>
    </div>
  );
};

export default ReproducaoCard;
