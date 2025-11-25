import React from "react";
import Button from "../../../common/buttons/Button";
import "./BaseCard.css";

import { formatDate } from "../../../../utils/formatDate";
import type { AplicacaoResponseDTO } from "../../../../api/dtos/aplicacao/AplicacaoResponseDTO";

interface AplicacaoCardProps {
  aplicacao: AplicacaoResponseDTO;
  onView: () => void;
  confirmado: boolean;
  onConfirm: () => void;
  responsavel?: string;
}

const AplicacaoCard: React.FC<AplicacaoCardProps> = ({
  aplicacao,
  onView,
  confirmado,
  onConfirm,
  responsavel,
}) => {
  const isVacina = aplicacao.medicamento?.isVacina === true;
  const titulo = isVacina ? "Vacinação" : "Medicação";

  return (
    <div className="card">
      <span className={`card-type ${isVacina ? "vacina" : "aplicacao"}`}>
        <div className="card-header-info flex">
          <strong>
            {titulo} (#{aplicacao.id})
          </strong>

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
          <strong>Ovino</strong>
        </div>
        <div className="card-col-main">{aplicacao.ovino?.nome ?? "—"}</div>
        <div className="card-meta">
          FBB: {aplicacao.ovino?.fbb ?? "—"} • RFID:{" "}
          {aplicacao.ovino?.rfid ?? "—"}
        </div>
      </div>
      <div>
        <div className="card-meta">
          <strong>{isVacina ? "Vacina" : "Medicamento"}:</strong>{" "}
          {aplicacao.medicamento?.nome ?? "—"}
          <br />
          <strong>Fabricante:</strong>{" "}
          {aplicacao.medicamento?.fabricante ?? "—"}
          <br />
          <strong>Data:</strong>{" "}
          {formatDate(aplicacao.dataAplicacao, true)}
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
      </div>
    </div>
  );
};

export default AplicacaoCard;
