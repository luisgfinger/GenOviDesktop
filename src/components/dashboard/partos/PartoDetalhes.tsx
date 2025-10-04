import React, { useMemo, useState } from "react";
import "./PartoDetalhes.css";
import ActionButtons from "../../common/buttons/ActionButtons";
import Button from "../../common/buttons/Button";
import type { PartoResponseDTO } from "../../../api/dtos/parto/PartoResponseDTO";
import { PartoService } from "../../../api/services/parto/PartoService";
import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import type { Ovino } from "../../../api/models/ovino/OvinoModel";
import { toast } from "react-toastify";
import { TypeSexo } from "../../../api/enums/typeSexo/TypeSexo";

function monthsBetween(iso?: string): number {
  if (!iso) return 0;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 0;
  const now = new Date();
  let months =
    (now.getFullYear() - d.getFullYear()) * 12 +
    (now.getMonth() - d.getMonth());
  if (now.getDate() < d.getDate()) months--;
  return Math.max(0, months);
}

const MIN_MALE_MONTHS = 7;
const MIN_FEMALE_MONTHS = 8;

function formatISODateTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const dia = d.toLocaleDateString();
  const hora = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${dia} ${hora}`;
}

interface PartoDetalhesProps {
  parto: PartoResponseDTO;
  onClose: () => void;
}

const PartoDetalhes: React.FC<PartoDetalhesProps> = ({ parto, onClose }) => {
  const { ovinos, loading: loadingOvinos, error } = useOvinos();

  const [editMode, setEditMode] = useState<
    Partial<Record<keyof PartoResponseDTO, boolean>>
  >({});
  const [updated, setUpdated] = useState<PartoResponseDTO>(parto);
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(false);

  const machos = useMemo(
    () =>
      (ovinos ?? []).filter(
        (o) =>
          o.sexo === TypeSexo.MACHO &&
          monthsBetween(o.dataNascimento) >= MIN_MALE_MONTHS
      ),
    [ovinos]
  );

  const femeas = useMemo(
    () =>
      (ovinos ?? []).filter(
        (o) =>
          o.sexo === TypeSexo.FEMEA &&
          monthsBetween(o.dataNascimento) >= MIN_FEMALE_MONTHS
      ),
    [ovinos]
  );

  const handleEditField = (field: keyof PartoResponseDTO) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field: keyof PartoResponseDTO, value: any) => {
    setUpdated((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (!updated.id) return;
    try {
      setLoading(true);
      const dto = {
        ovelhaMaeId: updated.ovelhaMae?.id,
        ovelhaPaiId: updated.ovelhaPai?.id,
        dataParto: updated.dataParto ?? "",
        gestacaoId: updated.gestacao?.id ?? undefined,
      };
      console.log(dto);
      console.log(updated.id);

      await PartoService.editar(updated.id, dto);
      toast.success("Alterações salvas com sucesso!");
      setHasChanges(false);
      setEditMode({});
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar alterações.");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async () => {
    if (!updated.id) return;
    if (!window.confirm("Tem certeza que deseja remover este parto?")) return;

    try {
      setLoading(true);
      await PartoService.remover(updated.id);
      toast.success("Parto removido com sucesso!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Erro ao remover parto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="parto-detalhes-overlay">
      <div className="parto-detalhes-card">
        <ActionButtons
          className="remove-btn"
          showEdit={false}
          onRemove={handleRemove}
        />

        <h2>Detalhes do Parto</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="parto-info">
          <div className="parto-row">
            <strong>Data do Parto:</strong>
            {editMode.dataParto ? (
              <input
                type="datetime-local"
                value={
                  updated.dataParto
                    ? new Date(updated.dataParto).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) => handleChange("dataParto", e.target.value)}
              />
            ) : (
              <span>{formatISODateTime(updated.dataParto)}</span>
            )}
            <ActionButtons
              onEdit={() => handleEditField("dataParto")}
              showRemove={false}
            />
          </div>

          <div className="parto-row">
            <strong>Carneiro (Pai):</strong>
            {editMode.ovelhaPai ? (
              loadingOvinos ? (
                <span>Carregando...</span>
              ) : (
                <select
                  value={updated.ovelhaPai?.id ?? ""}
                  onChange={(e) => {
                    const selected = machos?.find(
                      (o) => o.id === Number(e.target.value)
                    );
                    handleChange("ovelhaPai", selected as Ovino);
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
              <span>{updated.ovelhaPai?.nome ?? "—"}</span>
            )}
            <ActionButtons
              onEdit={() => handleEditField("ovelhaPai")}
              showRemove={false}
            />
          </div>

          <div className="parto-row">
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

          <div className="parto-row">
            <strong>Gestação vinculada:</strong>
            <span>
              {updated.gestacao?.id
                ? `#${updated.gestacao.id} — ${formatISODateTime(
                    updated.gestacao.dataGestacao
                  )}`
                : "—"}
            </span>
          </div>
        </div>

        <div className="parto-footer">
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

export default PartoDetalhes;
