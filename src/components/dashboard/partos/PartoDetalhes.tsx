import React, { useMemo } from "react";
import DetalhesBase, { type CampoConfig } from "../../common/detalhesBase/DetalhesBase";
import type { PartoResponseDTO } from "../../../api/dtos/parto/PartoResponseDTO";
import { PartoService } from "../../../api/services/parto/PartoService";
import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import { useGestacoes } from "../../../api/hooks/gestacao/UseGestacoes";
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
  const { ovinos, loading: loadingOvinos } = useOvinos();
  const { gestacoes, loading: loadingGestacoes } = useGestacoes();

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

  const campos: CampoConfig<PartoResponseDTO>[] = [
    {
      label: "Data do Parto",
      key: "dataParto",
      renderView: (valor) => formatISODateTime(valor),
      renderEdit: (valor, onChange) => (
        <input
          type="datetime-local"
          value={valor ? new Date(valor).toISOString().slice(0, 16) : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ),
    },
    {
      label: "Pai (Carneiro)",
      key: "ovinoPai",
      renderView: (valor) => valor?.nome ?? "—",
      renderEdit: (_, onChange) =>
        loadingOvinos ? (
          <span>Carregando...</span>
        ) : (
          <select
            onChange={(e) => {
              const selected = machos.find(
                (m) => m.id === Number(e.target.value)
              );
              onChange(selected);
            }}
            defaultValue={parto.ovinoPai?.id ?? ""}
          >
            <option value="">Selecione</option>
            {machos.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome || `#${m.id}`} — RFID: {m.rfid ?? "—"}
              </option>
            ))}
          </select>
        ),
    },
    {
      label: "Mãe (Ovelha)",
      key: "ovinoMae",
      renderView: (valor) => valor?.nome ?? "—",
      renderEdit: (_, onChange) =>
        loadingOvinos ? (
          <span>Carregando...</span>
        ) : (
          <select
            onChange={(e) => {
              const selected = femeas.find(
                (f) => f.id === Number(e.target.value)
              );
              onChange(selected);
            }}
            defaultValue={parto.ovinoMae?.id ?? ""}
          >
            <option value="">Selecione</option>
            {femeas.map((f) => (
              <option key={f.id} value={f.id}>
                {f.nome || `#${f.id}`} — RFID: {f.rfid ?? "—"}
              </option>
            ))}
          </select>
        ),
    },
    {
      label: "Gestação vinculada",
      key: "gestacao",
      renderView: (valor) =>
        valor?.id
          ? `#${valor.id} — ${formatISODateTime(valor.dataGestacao)}`
          : "—",
      renderEdit: (_, onChange) =>
        loadingGestacoes ? (
          <span>Carregando gestações...</span>
        ) : (
          <select
            onChange={(e) => {
              const selected = gestacoes.find(
                (g) => g.id === Number(e.target.value)
              );
              onChange(selected);
            }}
            defaultValue={parto.gestacao?.id ?? ""}
          >
            <option value="">Selecione</option>
            {gestacoes.map((g) => (
              <option key={g.id} value={g.id}>
                {`#${g.id}`} — {formatISODateTime(g.dataGestacao)}
              </option>
            ))}
          </select>
        ),
    },
  ];

  const handleSave = async (atualizado: PartoResponseDTO) => {
    if (!atualizado.id) return;
    await PartoService.editar(atualizado.id, {
      ovelhaMaeId: atualizado.ovinoMae.id,
      ovelhaPaiId: atualizado.ovinoPai?.id,
      dataParto: atualizado.dataParto ?? "",
      gestacaoId: atualizado.gestacao?.id ?? undefined,
    });
  };

  const handleRemove = async () => {
    if (!parto.id) return;
    await PartoService.remover(parto.id);
    onClose();
  };

  return (
    <DetalhesBase
      titulo="Detalhes do Parto"
      item={parto}
      campos={campos}
      onSave={handleSave}
      onRemove={handleRemove}
      onClose={onClose}
    />
  );
};

export default PartoDetalhes;
