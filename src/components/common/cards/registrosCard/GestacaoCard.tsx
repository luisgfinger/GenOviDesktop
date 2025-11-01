import React from "react";
import Button from "../../../common/buttons/Button";
import "./BaseCard.css";
import { formatDate } from "../../../../utils/formatDate";
import type { GestacaoResponseDTO } from "../../../../api/dtos/gestacao/GestacaoResponseDTO";

interface GestacaoCardProps {
  gestacao: GestacaoResponseDTO;
  onView: () => void;
  onEdit?: () => void;
}

const GestacaoCard: React.FC<GestacaoCardProps> = ({ gestacao, onView, onEdit }) => {
  return (
    <div className="card">
      <span className="card-type gestacao">Gestação</span>
      <div>
        <div className="card-col-title"><strong>Ovelha (mãe)</strong></div>
        <div className="card-col-main">{gestacao.ovelhaMae?.nome ?? "—"}</div>
        <div className="card-meta">
          RFID: {gestacao.ovelhaMae?.rfid ?? "—"}
        </div>
      </div>
      <div>
        <div className="card-col-title"><strong>Carneiro (pai)</strong></div>
        <div className="card-col-main">{gestacao.ovelhaPai?.nome ?? "—"}</div>
        <div className="card-meta">
          RFID: {gestacao.ovelhaPai?.rfid ?? "—"}
        </div>
      </div>
      <div>
        <div className="card-col-title"><strong>Início</strong></div>
        <div className="card-meta">{formatDate(gestacao.dataGestacao, true)}</div>
      </div>
      <div className="card-actions">
        <Button variant="cardSecondary" onClick={onView}>
          Ver mais
        </Button>
      </div>
    </div>
  );
};

export default GestacaoCard;
