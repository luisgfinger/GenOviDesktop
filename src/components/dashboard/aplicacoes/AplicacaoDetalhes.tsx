import React, { useState } from "react";
import "./AplicacaoDetalhes.css";
import ActionButtons from "../../common/buttons/ActionButtons";
import Button from "../../common/buttons/Button";
import { toast } from "react-toastify";

import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import { useMedicamentos } from "../../../api/hooks/medicamento/UseMedicamentos";
import { useEditarAplicacao, useRemoverAplicacao } from "../../../api/hooks/aplicacao/UseAplicacoes";

import type { AplicacaoResponseDTO } from "../../../api/dtos/aplicacao/AplicacaoResponseDTO";
import type { Ovino } from "../../../api/models/ovino/OvinoModel";
import type { MedicamentoResponseDTO } from "../../../api/dtos/medicamento/MedicamentoResponseDTO";

function formatAplicacaoDate(date?: any) {
  if (!date) return "—";

  if (typeof date === "string") {
    const d = new Date(date.includes("T") ? date : `${date}T00:00:00`);
    return !Number.isNaN(d.getTime()) ? d.toLocaleDateString() : "—";
  }

  if (typeof date === "object" && "year" in date && "month" in date && "day" in date) {
    const d = new Date(date.year, date.month - 1, date.day);
    return d.toLocaleDateString();
  }

  return "—";
}

interface AplicacaoDetalhesProps {
  aplicacao: AplicacaoResponseDTO;
  onClose: () => void;
}

const AplicacaoDetalhes: React.FC<AplicacaoDetalhesProps> = ({
  aplicacao,
  onClose,
}) => {
  const { ovinos, loading: loadingOvinos, error: errorOvinos } = useOvinos();
  const { medicamentos, loading: loadingMeds, error: errorMeds } = useMedicamentos();
  const { editarAplicacao, loading: saving } = useEditarAplicacao();
  const { removerAplicacao, loading: removing } = useRemoverAplicacao();

  const [editMode, setEditMode] = useState<
    Partial<Record<keyof AplicacaoResponseDTO, boolean>>
  >({});
  const [updated, setUpdated] = useState<AplicacaoResponseDTO>(aplicacao);
  const [hasChanges, setHasChanges] = useState(false);

  const handleEditField = (field: keyof AplicacaoResponseDTO) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field: keyof AplicacaoResponseDTO, value: any) => {
    setUpdated((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!updated.id)  return;

    try {
      await editarAplicacao(updated.id, {
        ovinoId: updated.ovino?.id ?? null,
        medicamentoId: updated.medicamento?.id ?? null,
        dataAplicacao: updated.dataAplicacao ?? "",
      });
      toast.success("✅ Alterações salvas com sucesso!");
      setHasChanges(false);
      setEditMode({});
    } catch {
      toast.error("❌ Erro ao salvar alterações.");
    }
  };

  const handleRemove = async () => {
    if (!updated.id) return;
    if (!window.confirm("Tem certeza que deseja remover esta aplicação?")) return;

    try {
      await removerAplicacao(updated.id);
      toast.success("🗑️ Aplicação removida com sucesso!");
      onClose();
    } catch {
      toast.error("❌ Erro ao remover aplicação.");
    }
  };

  return (
    <div className="aplicacao-detalhes-overlay">
      <div className="aplicacao-detalhes-card">
        <ActionButtons
          className="remove-btn"
          showEdit={false}
          onRemove={handleRemove}
        />

        <h2>Detalhes da Aplicação</h2>

        {(errorOvinos || errorMeds) && (
          <p style={{ color: "red" }}>
            {errorOvinos || errorMeds}
          </p>
        )}

        <div className="aplicacao-info">
          <div className="aplicacao-row">
            <strong>Ovino:</strong>
            {editMode.ovino ? (
              loadingOvinos ? (
                <span>Carregando...</span>
              ) : (
                <select
                  value={updated.ovino?.id ?? ""}
                  onChange={(e) => {
                    const selected = ovinos?.find(
                      (o) => o.id === Number(e.target.value)
                    );
                    handleChange("ovino", selected as Ovino);
                  }}
                >
                  <option value="">Selecione o ovino...</option>
                  {ovinos?.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.nome} • RFID: {o.rfid ?? "—"}
                    </option>
                  ))}
                </select>
              )
            ) : (
              <span>{updated.ovino?.nome ?? "—"}</span>
            )}
            <ActionButtons onEdit={() => handleEditField("ovino")} showRemove={false} />
          </div>

          <div className="aplicacao-row">
            <strong>Medicamento/Vacina:</strong>
            {editMode.medicamento ? (
              loadingMeds ? (
                <span>Carregando...</span>
              ) : (
                <select
                  value={updated.medicamento?.id ?? ""}
                  onChange={(e) => {
                    const selected = medicamentos?.find(
                      (m) => m.id === Number(e.target.value)
                    );
                    handleChange("medicamento", selected as MedicamentoResponseDTO);
                  }}
                >
                  <option value="">Selecione...</option>
                  {medicamentos?.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome} • Fabricante: {m.fabricante}
                    </option>
                  ))}
                </select>
              )
            ) : (
              <span>{updated.medicamento?.nome ?? "—"}</span>
            )}
            <ActionButtons
              onEdit={() => handleEditField("medicamento")}
              showRemove={false}
            />
          </div>

          <div className="aplicacao-row">
            <strong>Data:</strong>
            {editMode.dataAplicacao ? (
              <input
                type="datetime-local"
                value={
                  updated.dataAplicacao
                    ? new Date(updated.dataAplicacao)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                onChange={(e) => handleChange("dataAplicacao", e.target.value)}
              />
            ) : (
              <span>{formatAplicacaoDate(updated.dataAplicacao)}</span>
            )}
            <ActionButtons
              onEdit={() => handleEditField("dataAplicacao")}
              showRemove={false}
            />
          </div>
        </div>

        <div className="aplicacao-footer">
          {hasChanges ? (
            <Button
              variant="cardPrimary"
              onClick={handleSave}
              disabled={saving || removing}
            >
              {saving ? "Salvando..." : "Salvar alterações"}
            </Button>
          ) : (
            <Button
              variant="cardSecondary"
              onClick={onClose}
              disabled={saving || removing}
            >
              {removing ? "Removendo..." : "Fechar"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AplicacaoDetalhes;
