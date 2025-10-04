import React, { useState } from "react";
import "./ReproducoesDetalhes.css";
import ActionButtons from "../../common/buttons/ActionButtons";
import Button from "../../common/buttons/Button";
import type { ReproducaoResponseDTO } from "../../../api/dtos/reproducao/ReproducaoResponseDTO";
import { formatEnum } from "../../../utils/formatEnum";
import { TypeReproducao } from "../../../api/enums/typeReproducao/TypeReproducao";
import { ReproducaoService } from "../../../api/services/reproducao/ReproducaoService";
import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import type { Ovino } from "../../../api/models/ovino/OvinoModel";
import { toast } from "react-toastify";

function formatISODateTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const dia = d.toLocaleDateString();
  const hora = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${dia} ${hora}`;
}

interface ReproducaoDetalhesProps {
  reproducao: ReproducaoResponseDTO;
  onClose: () => void;
}

const ReproducaoDetalhes: React.FC<ReproducaoDetalhesProps> = ({
  reproducao,
  onClose,
}) => {
  const { ovinos, loading: loadingOvinos, error } = useOvinos();

  const [editMode, setEditMode] = useState<
    Partial<Record<keyof ReproducaoResponseDTO, boolean>>
  >({});
  const [updated, setUpdated] = useState<ReproducaoResponseDTO>(reproducao);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  const machos = ovinos?.filter((o) => o.sexo === "MACHO");
  const femeas = ovinos?.filter((o) => o.sexo === "FEMEA");

  const handleEditField = (field: keyof ReproducaoResponseDTO) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field: keyof ReproducaoResponseDTO, value: any) => {
    setUpdated((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!updated.id) return;
    try {
      setLoading(true);

      const dto = {
        carneiroId: updated.carneiroPai?.id ?? null,
        ovelhaId: updated.ovelhaMae?.id ?? null,
        typeReproducao: updated.typeReproducao ?? "",
        dataReproducao: updated.dataReproducao ?? "",
        observacoes: updated.observacoes ?? "",
      };

      await ReproducaoService.editar(updated.id, dto);
      toast.success("✅ Alterações salvas com sucesso!");
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
    if (!window.confirm("Tem certeza que deseja remover esta reprodução?"))
      return;

    try {
      setLoading(true);
      await ReproducaoService.remover(updated.id);
      toast.success("🗑️ Reprodução removida com sucesso!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("❌ Erro ao remover reprodução.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="repro-detalhes-overlay">
      <div className="repro-detalhes-card">
        <ActionButtons
          className="remove-btn"
          showEdit={false}
          onRemove={handleRemove}
        />

        <h2>Detalhes da Reprodução</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="repro-info">
          <div className="repro-row">
            <strong>Tipo:</strong>
            {editMode.typeReproducao ? (
              <select
                value={updated.typeReproducao ?? ""}
                onChange={(e) =>
                  handleChange("typeReproducao", e.target.value as TypeReproducao)
                }
              >
                <option value="">Selecione</option>
                {Object.values(TypeReproducao).map((tipo) => (
                  <option key={tipo} value={tipo}>
                    {formatEnum(tipo as TypeReproducao)}
                  </option>
                ))}
              </select>
            ) : (
              <span>
                {updated.typeReproducao
                  ? formatEnum(updated.typeReproducao as TypeReproducao)
                  : "—"}
              </span>
            )}
            <ActionButtons
              onEdit={() => handleEditField("typeReproducao")}
              showRemove={false}
            />
          </div>
          <div className="repro-row">
            <strong>Data:</strong>
            {editMode.dataReproducao ? (
              <input
                type="datetime-local"
                value={
                  updated.dataReproducao
                    ? new Date(updated.dataReproducao)
                        .toISOString()
                        .slice(0, 16)
                    : ""
                }
                onChange={(e) =>
                  handleChange("dataReproducao", e.target.value)
                }
              />
            ) : (
              <span>{formatISODateTime(updated.dataReproducao)}</span>
            )}
            <ActionButtons
              onEdit={() => handleEditField("dataReproducao")}
              showRemove={false}
            />
          </div>
          <div className="repro-row">
            <strong>Carneiro (Pai):</strong>
            {editMode.carneiroPai ? (
              loadingOvinos ? (
                <span>Carregando...</span>
              ) : (
                <select
                  value={updated.carneiroPai?.id ?? ""}
                  onChange={(e) => {
                    const selected = machos?.find(
                      (o) => o.id === Number(e.target.value)
                    );
                    handleChange("carneiroPai", selected as Ovino);
                  }}
                >
                  <option value="">Selecione</option>
                  {machos?.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.nome || `#${m.id}`} — RFID: {m.rfid ?? "—"}
                    </option>
                  ))}
                </select>
              )
            ) : (
              <span>{updated.carneiroPai?.nome ?? "—"}</span>
            )}
            <ActionButtons
              onEdit={() => handleEditField("carneiroPai")}
              showRemove={false}
            />
          </div>
          <div className="repro-row">
            <strong>Ovelha (Mãe):</strong>
            {editMode.ovelhaMae ? (
              loadingOvinos ? (
                <span>Carregando...</span>
              ) : (
                <select
                  value={updated.ovelhaMae?.id ?? ""}
                  onChange={(e) => {
                    const selected = femeas?.find(
                      (o) => o.id === Number(e.target.value)
                    );
                    handleChange("ovelhaMae", selected as Ovino);
                  }}
                >
                  <option value="">Selecione</option>
                  {femeas?.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.nome || `#${f.id}`} — RFID: {f.rfid ?? "—"}
                    </option>
                  ))}
                </select>
              )
            ) : (
              <span>{updated.ovelhaMae?.nome ?? "—"}</span>
            )}
            <ActionButtons
              onEdit={() => handleEditField("ovelhaMae")}
              showRemove={false}
            />
          </div>
          <div className="repro-row observacoes">
            <strong>Observações:</strong>
            {editMode.observacoes ? (
              <textarea
                value={updated.observacoes ?? ""}
                onChange={(e) =>
                  handleChange("observacoes", e.target.value)
                }
                rows={4}
              />
            ) : (
              <p>{updated.observacoes || "—"}</p>
            )}
            <ActionButtons
              onEdit={() => handleEditField("observacoes")}
              showRemove={false}
            />
          </div>
        </div>

        <div className="repro-footer">
          {hasChanges ? (
            <Button variant="cardPrimary" onClick={handleSave} disabled={loading}>
              {loading ? "Salvando..." : "Salvar alterações"}
            </Button>
          ) : (
            <Button variant="cardSecondary" onClick={onClose} disabled={loading}>
              {loading ? "Carregando..." : "Fechar"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReproducaoDetalhes;
