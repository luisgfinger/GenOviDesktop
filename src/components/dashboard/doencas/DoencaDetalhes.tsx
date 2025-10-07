import React, { useState } from "react";
import "./DoencaDetalhes.css";
import ActionButtons from "../../common/buttons/ActionButtons";
import Button from "../../common/buttons/Button";
import { DoencaService } from "../../../api/services/doenca/DoencaService";
import type { DoencaResponseDTO } from "../../../api/dtos/doenca/DoencaResponseDTO";
import { toast } from "react-toastify";

interface DoencaDetalhesProps {
  doenca: DoencaResponseDTO;
  onClose: () => void;
}

const DoencaDetalhes: React.FC<DoencaDetalhesProps> = ({ doenca, onClose }) => {
  const [editMode, setEditMode] = useState<
    Partial<Record<keyof DoencaResponseDTO, boolean>>
  >({});
  const [updated, setUpdated] = useState<DoencaResponseDTO>(doenca);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEditField = (field: keyof DoencaResponseDTO) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field: keyof DoencaResponseDTO, value: any) => {
    setUpdated((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!updated.id) return;
    try {
      setLoading(true);

      const dto = {
        nome: updated.nome,
        descricao: updated.descricao ?? "",
      };

      await DoencaService.editar(updated.id, dto);
      toast.success("💾 Alterações salvas com sucesso!");
      setHasChanges(false);
      setEditMode({});
    } catch (err) {
      console.error(err);
      toast.error("❌ Erro ao salvar alterações.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!updated.id) return;
    if (!window.confirm("Tem certeza que deseja remover esta doença?")) return;

    try {
      setLoading(true);
      await DoencaService.remover(updated.id);
      toast.success("🗑️ Doença removida com sucesso!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("❌ Erro ao remover a doença.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="doenca-detalhes-overlay">
      <div className="doenca-detalhes-card">
        <ActionButtons
          className="remove-btn"
          showEdit={false}
          onRemove={handleRemove}
        />

        <h2>Detalhes da Doença</h2>

        <div className="doenca-info">
          <div className="doenca-row">
            <strong>Nome:</strong>
            {editMode.nome ? (
              <input
                type="text"
                value={updated.nome}
                onChange={(e) => handleChange("nome", e.target.value)}
              />
            ) : (
              <span>{updated.nome}</span>
            )}
            <ActionButtons
              onEdit={() => handleEditField("nome")}
              showRemove={false}
            />
          </div>

          <div className="doenca-row">
            <strong>Descrição:</strong>
            {editMode.descricao ? (
              <textarea
                value={updated.descricao ?? ""}
                onChange={(e) => handleChange("descricao", e.target.value)}
              />
            ) : (
              <span>{updated.descricao ?? "—"}</span>
            )}
            <ActionButtons
              onEdit={() => handleEditField("descricao")}
              showRemove={false}
            />
          </div>
        </div>

        <div className="doenca-footer">
          {hasChanges ? (
            <Button
              variant="cardPrimary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          ) : (
            <Button
              variant="cardSecondary"
              onClick={onClose}
              disabled={loading}
            >
              {loading ? "Carregando..." : "Fechar"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoencaDetalhes;
