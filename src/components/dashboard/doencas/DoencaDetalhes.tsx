import React from "react";
import DetalhesBase, { type CampoConfig } from "../../common/detalhesBase/DetalhesBase";
import type { DoencaResponseDTO } from "../../../api/dtos/doenca/DoencaResponseDTO";
import { DoencaService } from "../../../api/services/doenca/DoencaService";

interface DoencaDetalhesProps {
  doenca: DoencaResponseDTO;
  onClose: () => void;
}

const DoencaDetalhes: React.FC<DoencaDetalhesProps> = ({ doenca, onClose }) => {
  const campos: CampoConfig<DoencaResponseDTO>[] = [
    {
      label: "Nome da Doença",
      key: "nome",
      renderView: (valor) => valor ?? "—",
      renderEdit: (valor, onChange) => (
        <input
          type="text"
          value={valor ?? ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Digite o nome da doença"
        />
      ),
    },
    {
      label: "Descrição",
      key: "descricao",
      renderView: (valor) => (
        <span className="text-breaker">{valor ?? "—"}</span>
      ),
      renderEdit: (valor, onChange) => (
        <textarea
          value={valor ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder="Descreva os sintomas, causas, etc."
          maxLength={255}
        />
      ),
    },
  ];

  const handleSave = async (atualizado: DoencaResponseDTO) => {
    if (!atualizado.id) return;
    const dto = {
      nome: atualizado.nome,
      descricao: atualizado.descricao ?? "",
    };

    await DoencaService.editar(atualizado.id, dto);
  };

  const handleRemove = async () => {
    if (!doenca.id) return;
    await DoencaService.remover(doenca.id);
    onClose();
  };

  return (
    <DetalhesBase
      titulo="Detalhes da Doença"
      item={doenca}
      campos={campos}
      onSave={handleSave}
      onRemove={handleRemove}
      onClose={onClose}
    />
  );
};

export default DoencaDetalhes;
