import React, { useMemo, useState } from "react";
import "./GestacaoDetalhes.css";
import ActionButtons from "../../common/buttons/ActionButtons";
import Button from "../../common/buttons/Button";
import type { GestacaoResponseDTO } from "../../../api/dtos/gestacao/GestacaoResponseDTO";
import { GestacaoService } from "../../../api/services/gestacao/GestacaoService";
import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import type { Ovino } from "../../../api/models/ovino/OvinoModel";
import { toast } from "react-toastify";
import { formatEnum } from "../../../utils/formatEnum";
import { TypeReproducao } from "../../../api/enums/typeReproducao/TypeReproducao";
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

interface GestacaoDetalhesProps {
  gestacao: GestacaoResponseDTO;
  onClose: () => void;
}

const GestacaoDetalhes: React.FC<GestacaoDetalhesProps> = ({
  gestacao,
  onClose,
}) => {
  const { ovinos, loading: loadingOvinos, error } = useOvinos();

  const [editMode, setEditMode] = useState<
    Partial<Record<keyof GestacaoResponseDTO, boolean>>
  >({});
  const [updated, setUpdated] = useState<GestacaoResponseDTO>(gestacao);
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

  const handleEditField = (field: keyof GestacaoResponseDTO) => {
    setEditMode((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (field: keyof GestacaoResponseDTO, value: any) => {
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
        dataGestacao: updated.dataGestacao ?? "",
        reproducaoId: updated.reproducao?.id ?? undefined,
      };

      await GestacaoService.editar(updated.id, dto);
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
    if (!window.confirm("Tem certeza que deseja remover esta gestação?"))
      return;

    try {
      setLoading(true);
      await GestacaoService.remover(updated.id);
      toast.success("🗑️ Gestação removida com sucesso!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("❌ Erro ao remover gestação.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gestacao-detalhes-overlay">
      <div className="gestacao-detalhes-card">
        <ActionButtons
          className="remove-btn"
          showEdit={false}
          onRemove={handleRemove}
        />

        <h2>Detalhes da Gestação</h2>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="gestacao-info">
          <div className="gestacao-row">
            <strong>Data da Gestação:</strong>
            {editMode.dataGestacao ? (
              <input
                type="datetime-local"
                value={
                  updated.dataGestacao
                    ? new Date(updated.dataGestacao).toISOString().slice(0, 16)
                    : ""
                }
                onChange={(e) => handleChange("dataGestacao", e.target.value)}
              />
            ) : (
              <span>{formatISODateTime(updated.dataGestacao)}</span>
            )}
            <ActionButtons
              onEdit={() => handleEditField("dataGestacao")}
              showRemove={false}
            />
          </div>

          <div className="gestacao-row">
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

          <div className="gestacao-row">
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

          <div className="gestacao-row">
            <strong>Reprodução vinculada:</strong>
            <span>
              {updated.reproducao?.id
                ? `#${updated.reproducao.id} — ${
                    updated.reproducao.typeReproducao
                      ? formatEnum(
                          updated.reproducao.typeReproducao as TypeReproducao
                        )
                      : "Sem tipo"
                  }`
                : "—"}
            </span>
          </div>
        </div>

        <div className="gestacao-footer">
          {hasChanges ? (
            <Button
              variant="cardPrimary"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar alterações"}
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

export default GestacaoDetalhes;
