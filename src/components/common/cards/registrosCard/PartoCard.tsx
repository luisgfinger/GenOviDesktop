import React from "react";
import Button from "../../../common/buttons/Button";
import "./BaseCard.css";

import { formatDate } from "../../../../utils/formatDate";
import type { PartoResponseDTO } from "../../../../api/dtos/parto/PartoResponseDTO";

interface PartoCardProps {
  parto: PartoResponseDTO;
  onView: () => void;
  onEdit?: () => void;
}

const PartoCard: React.FC<PartoCardProps> = ({ parto, onView, onEdit }) => {
  return (
    <div className="card">
      <span className="card-type">Parto</span>
      <div>
        <div className="card-col-title"><strong>Ovelha (mãe)</strong></div>
        <div className="card-col-main">{parto.mae?.nome ?? "—"}</div>
        <div className="card-meta">
          FBB: {parto.mae?.fbb ?? "—"} • RFID: {parto.mae?.rfid ?? "—"}
        </div>
      </div>
      <div>
        <div className="card-col-title"><strong>Carneiro (pai)</strong></div>
        <div className="card-col-main">{parto.mae?.nome ?? "—"}</div>
        <div className="card-meta">
          FBB: {parto.mae?.fbb ?? "—"} • RFID: {parto.mae?.rfid ?? "—"}
        </div>
      </div>
      <div>
        <div className="card-col-title"><strong>Data do Parto</strong></div>
        <div className="card-meta">{formatDate(parto.dataParto, true)}</div>
      </div>
      <div className="card-actions">
        <Button variant="cardSecondary" onClick={onView}>
          Ver mais
        </Button>
      </div>
    </div>
  );
};

export default PartoCard;
