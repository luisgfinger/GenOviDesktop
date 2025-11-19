import React from "react";
import "./OvinoCardFull.css";
import OvinoDefaultImg from "../../../../assets/images/ovinoImagem.png";
import { formatEnum } from "../../../../utils/formatEnum";
import type { Ovino } from "../../../../api/models/ovino/OvinoModel";
import ActionButtons from "../../buttons/ActionButtons";
import { formatDate } from "../../../../utils/formatDate";

interface OvinoCardFullProps {
  ovino: Ovino;
  imagem?: string;
  onEdit?: (field: keyof Ovino) => void;
  onRemove?: () => void;
}

const OvinoCardFull: React.FC<OvinoCardFullProps> = ({
  ovino,
  imagem = OvinoDefaultImg,
  onEdit,
  onRemove,
}) => {
  const renderField = (
    label: string,
    value: string | number | undefined,
    field?: keyof Ovino
  ) => (
    <div className="ovinoCardFull-field flex">
      <h3>{label}:</h3>
      <p>{value ?? "Não informado"}</p>
      {field && (
        <ActionButtons
          showRemove={false}
          onEdit={() => onEdit?.(field)}
          className="ovinoCardFull-edit-btn"
          size={20}
        />
      )}
    </div>
  );

  return (
    <div className="ovinoCardFull-container flex-column">
      <ActionButtons
        className="ovinoCardFull-remove-btn"
        showEdit={false}
        onRemove={onRemove}
      />

      <div className="ovinoCardFull-header flex">
        <img src={imagem} alt={ovino.nome} />
        <div className="flex-column">
          <h2>{ovino.nome}</h2>
          <div className="ovinoCardFull-field flex">
            <p>{formatEnum(ovino.sexo)}</p>
            <ActionButtons
              showRemove={false}
              onEdit={() => onEdit?.("sexo")}
              className="ovinoCardFull-edit-btn"
              size={20}
            />
          </div>
        </div>
      </div>

      <div className="ovinoCardFull-details grid">
        {renderField("RFID", ovino.rfid, "rfid")}
        {renderField("FBB", ovino.fbb, "fbb")}
        {renderField("Raça", formatEnum(ovino.raca), "raca")}

        {renderField(
          "Data Nascimento",
          ovino.dataNascimento
            ? (formatDate(ovino.dataNascimento, true) ?? "Não informado")
            : "Não informado",
          "dataNascimento"
        )}
        {renderField("Status", formatEnum(ovino.status), "status")}
         {renderField(
          "Data de Cadastro",
          ovino.dataCadastro
            ? (formatDate(ovino.dataCadastro, true) ?? "Não informado")
            : "Não informado",
          "dataCadastro"
        )}
        {renderField(
          "Grau de Pureza",
          formatEnum(ovino.grauPureza),
          "grauPureza"
        )}

       

        {renderField("Parto", ovino.parto?.id, "parto")}
        {renderField("Mãe", ovino.ovinoMae?.nome, "ovinoMae")}
        {renderField("Compra", ovino.compra?.id, "compra")}
        {renderField("Pai", ovino.ovinoPai?.nome, "ovinoPai")}
        {renderField(
          "Peso",
          ovino.pesagens?.length
            ? `${ovino.pesagens[ovino.pesagens.length - 1].peso} kg`
            : "Não informado"
        )}
      </div>
    </div>
  );
};

export default OvinoCardFull;
