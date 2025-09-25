import React from "react";
import "./OvinoCardFull.css";
import OvinoDefaultImg from "../../../../assets/images/ovinoImagem.png";
import { formatEnum } from "../../../../utils/formatEnum";
import type { Ovino } from "../../../../api/models/ovino/OvinoModel";
import Pencil from "../../../../assets/icons/pencil.png";

interface OvinoCardFullProps {
  ovino: Ovino;
  imagem?: string;
  onEdit?: (field: keyof Ovino) => void;
}

const OvinoCardFull: React.FC<OvinoCardFullProps> = ({
  ovino,
  imagem = OvinoDefaultImg,
  onEdit,
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
        <button
          type="button"
          className="edit-button"
          onClick={() => onEdit && onEdit(field)}
        >
          <img src={Pencil} alt="pencil" />
        </button>
      )}
    </div>
  );

  return (
    <div className="ovinoCardFull-container flex-column">
      <div className="ovinoCardFull-header flex">
        <img src={imagem} alt={ovino.nome} />
        <div className="flex-column">
          <h2>{ovino.nome}</h2>
          <p>{formatEnum(ovino.sexo)}</p>
        </div>
      </div>

      <div className="ovinoCardFull-details grid">
        {renderField("ID", ovino.id)}
        {renderField("RFID", ovino.rfid, "rfid")}
        {renderField("FBB", ovino.fbb, "fbb")}
        {renderField("Raça", formatEnum(ovino.raca), "raca")}
        {renderField("Grau de Pureza", formatEnum(ovino.typeGrauPureza), "typeGrauPureza")}
        {renderField("Status", formatEnum(ovino.status), "status")}
        {renderField("Data Nascimento", ovino.dataNascimento?.split("T")[0], "dataNascimento")}
        {renderField("Data Cadastro", ovino.dataCadastro?.split("T")[0], "dataCadastro")}
        {renderField("Pai", ovino.ovinoPai?.nome, "ovinoPai")}
        {renderField("Mãe", ovino.ovinoMae?.nome, "ovinoMae")}
        {renderField("Compra", ovino.compra?.id, "compra")}
        {renderField("Parto", ovino.parto?.id, "parto")}
        {renderField(
          "Pesagens",
          ovino.pesagens?.length
            ? `${ovino.pesagens.length} registro(s)`
            : "Nenhuma",
          "pesagens"
        )}
      </div>
    </div>
  );
};

export default OvinoCardFull;
