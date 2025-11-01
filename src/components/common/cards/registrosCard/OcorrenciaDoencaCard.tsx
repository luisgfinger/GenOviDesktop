import React from "react";
import Button from "../../../common/buttons/Button";
import "./BaseCard.css";
import { formatDate } from "../../../../utils/formatDate";
import type { OcorrenciaDoencaResponseDTO } from "../../../../api/dtos/ocorrendiaDoenca/OcorrenciaDoencaResponseDTO";

interface OcorrenciaDoencaCardProps {
  ocorrencia: OcorrenciaDoencaResponseDTO;
  onView: () => void;
  onMarkCurado?: () => void;
}

const OcorrenciaDoencaCard: React.FC<OcorrenciaDoencaCardProps> = ({
  ocorrencia,
  onView,
  onMarkCurado,
}) => {
  return (
    <div className="card">
      <span className="card-type ocorrencia">Adoecimento</span>

      <div>
        <div className="card-col-title"><strong>Ovino</strong></div>
        <div className="card-col-main">{ocorrencia.ovino?.nome ?? "—"}</div>
        <div className="card-meta">RFID: {ocorrencia.ovino?.rfid ?? "—"}</div>
      </div>

      <div>
        <div className="card-meta">
          <strong>Doença:</strong> {ocorrencia.doenca?.nome ?? "—"}
          <br />
          <strong>Data de Início:</strong>{" "}
          {formatDate(ocorrencia.dataInicio, true)}
          {ocorrencia.dataFinal && (
            <>
              <br />
              <strong>Data Final:</strong> {formatDate(ocorrencia.dataFinal, true)}
            </>
          )}
          {!ocorrencia.dataFinal && (
            <>
              <br />
              <strong>Curado:</strong> {ocorrencia.curado ? "Sim" : "Não"}
            </>
          )}
        </div>
      </div>

      <div>
        <div className="card-col-title"><strong>Descrição</strong></div>
        <div className="card-meta">
          {ocorrencia.doenca?.descricao ?? "—"}
        </div>
      </div>

      <div className="card-actions">
        <Button variant="cardSecondary" onClick={onView}>
          Ver mais
        </Button>

        {!ocorrencia.curado && onMarkCurado && (
          <Button variant="cardPrimary" onClick={onMarkCurado}>
            Marcar como curado
          </Button>
        )}
      </div>
    </div>
  );
};

export default OcorrenciaDoencaCard;
