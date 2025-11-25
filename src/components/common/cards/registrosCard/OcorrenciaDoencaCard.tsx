import React from "react";
import Button from "../../../common/buttons/Button";
import "./BaseCard.css";
import { formatDate } from "../../../../utils/formatDate";
import type { OcorrenciaDoencaResponseDTO } from "../../../../api/dtos/ocorrendiaDoenca/OcorrenciaDoencaResponseDTO";

interface OcorrenciaDoencaCardProps {
  ocorrencia: OcorrenciaDoencaResponseDTO;
  onView: () => void;
  onMarkCurado?: () => void;
  confirmado: boolean;
  onConfirm: () => void;
  responsavel?: string;
}

const OcorrenciaDoencaCard: React.FC<OcorrenciaDoencaCardProps> = ({
  ocorrencia,
  onView,
  onMarkCurado,
  confirmado,
  onConfirm,
  responsavel,
}) => {
  return (
    <div className="card">
      <span className="card-type ocorrencia">
        <div className="card-header-info flex">
          <strong>Adoecimento (#{ocorrencia.id})</strong>
          
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
        <div className="card-col-main">{ocorrencia.ovino?.nome ?? "—"}</div>
        <div className="card-meta">RFID: {ocorrencia.ovino?.rfid ?? "—"}</div>
      </div>
      <div>
        <div className="card-meta">
          <strong>Doença:</strong> {ocorrencia.doenca?.nome ?? "—"}
          <br />
          <strong>Início:</strong> {formatDate(ocorrencia.dataInicio, true)}

          {ocorrencia.dataFinal ? (
            <>
              <br />
              <strong>Fim:</strong> {formatDate(ocorrencia.dataFinal, true)}
            </>
          ) : (
            <>
              <br />
              <strong>Curado:</strong> {ocorrencia.curado ? "Sim" : "Não"}
            </>
          )}
        </div>
      </div>
      <div>
        <div className="card-col-title">
          <strong>Descrição</strong>
        </div>
        <div className="card-meta">
          {ocorrencia.doenca?.descricao ?? "—"}
        </div>
      </div>
      <div className="card-actions">
        <Button variant="cardSecondary" onClick={onView}>
          Ver mais
        </Button>
        {confirmado && !ocorrencia.curado && onMarkCurado && (
          <Button variant="cardPrimary" onClick={onMarkCurado}>
            Marcar como curado
          </Button>
        )}
        {!confirmado && (
          <Button variant="cardPrimary" onClick={onConfirm}>
            Confirmar
          </Button>
        )}
      </div>
    </div>
  );
};

export default OcorrenciaDoencaCard;
