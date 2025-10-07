import React, { useState } from "react";
import "./MedicamentoDetalhes.css";
import ActionButtons from "../../common/buttons/ActionButtons";
import Button from "../../common/buttons/Button";
import { MedicamentoService } from "../../../api/services/medicamento/MedicamentoService";
import type { MedicamentoResponseDTO } from "../../../api/dtos/medicamento/MedicamentoResponseDTO";
import { toast } from "react-toastify";

interface MedicamentoDetalhesProps {
  medicamento: MedicamentoResponseDTO;
  onClose: () => void;
}

const MedicamentoDetalhes: React.FC<MedicamentoDetalhesProps> = ({
  medicamento,
  onClose,
}) => {
  const [editMode, setEditMode] = useState<
    Partial<Record<keyof MedicamentoResponseDTO, boolean>>
  >({});
  const [updated, setUpdated] = useState<MedicamentoResponseDTO>(medicamento);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEditField = (field: keyof MedicamentoResponseDTO) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field: keyof MedicamentoResponseDTO, value: any) => {
    setUpdated((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

 const handleSave = async () => {
  if (!updated.id) return;
  try {
    setLoading(true);

    const dto = {
      nome: updated.nome,
      fabricante: updated.fabricante,
      quantidadeDoses: updated.quantidadeDoses,
      intervaloDoses: updated.intervaloDoses,
      isVacina: updated.isVacina,
      doencasIds: updated.doencas?.map((d) => d.id) ?? [],
    };

    await MedicamentoService.atualizar(updated.id, dto);
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
    if (!window.confirm("Tem certeza que deseja remover este medicamento?")) return;

    try {
      setLoading(true);
      await MedicamentoService.remover(updated.id);
      toast.success("🗑️ Medicamento removido com sucesso!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao remover medicamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="medicamento-detalhes-overlay">
      <div className="medicamento-detalhes-card">
        <ActionButtons
          className="remove-btn"
          showEdit={false}
          onRemove={handleRemove}
        />

        <h2>Detalhes do Medicamento</h2>

        <div className="medicamento-info">
          <div className="medicamento-row">
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

          <div className="medicamento-row">
            <strong>Fabricante:</strong>
            {editMode.fabricante ? (
              <input
                type="text"
                value={updated.fabricante}
                onChange={(e) => handleChange("fabricante", e.target.value)}
              />
            ) : (
              <span>{updated.fabricante}</span>
            )}
            <ActionButtons
              onEdit={() => handleEditField("fabricante")}
              showRemove={false}
            />
          </div>

          <div className="medicamento-row">
            <strong>Quantidade de Doses:</strong>
            {editMode.quantidadeDoses ? (
              <input
                type="number"
                min={1}
                value={updated.quantidadeDoses}
                onChange={(e) =>
                  handleChange("quantidadeDoses", Number(e.target.value))
                }
              />
            ) : (
              <span>{updated.quantidadeDoses}</span>
            )}
            <ActionButtons
              onEdit={() => handleEditField("quantidadeDoses")}
              showRemove={false}
            />
          </div>

          <div className="medicamento-row">
            <strong>Intervalo entre Doses (dias):</strong>
            {editMode.intervaloDoses ? (
              <input
                type="number"
                min={0}
                value={updated.intervaloDoses}
                onChange={(e) =>
                  handleChange("intervaloDoses", Number(e.target.value))
                }
              />
            ) : (
              <span>{updated.intervaloDoses}</span>
            )}
            <ActionButtons
              onEdit={() => handleEditField("intervaloDoses")}
              showRemove={false}
            />
          </div>

          <div className="medicamento-row">
            <strong>Tipo:</strong>
            {editMode.isVacina ? (
              <select
                value={updated.isVacina ? "true" : "false"}
                onChange={(e) =>
                  handleChange("isVacina", e.target.value === "true")
                }
              >
                <option value="false">Medicamento Comum</option>
                <option value="true">Vacina</option>
              </select>
            ) : (
              <span>{updated.isVacina ? "Vacina" : "Medicamento Comum"}</span>
            )}
            <ActionButtons
              onEdit={() => handleEditField("isVacina")}
              showRemove={false}
            />
          </div>

          {updated.doencas?.length > 0 && (
            <div className="medicamento-row">
              <strong>Trata:</strong>
              <ul>
                {updated.doencas.map((d) => (
                  <li key={d.id}>{d.nome}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="medicamento-footer">
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

export default MedicamentoDetalhes;
