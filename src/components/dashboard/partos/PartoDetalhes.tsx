import React, { useMemo } from "react";
import DetalhesBase, { type CampoConfig } from "../../common/detalhesBase/DetalhesBase";
import type { PartoResponseDTO } from "../../../api/dtos/parto/PartoResponseDTO";
import { PartoService } from "../../../api/services/parto/PartoService";
import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import { useGestacoes } from "../../../api/hooks/gestacao/UseGestacoes";
import { TypeSexo } from "../../../api/enums/typeSexo/TypeSexo";
import { formatDate } from "../../../utils/formatDate";
import { DateToIsoString } from "../../../utils/dateToIsoString";

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
      renderView: (valor) => formatDate(valor, true),
      renderEdit: (valor, onChange) => (
        <input
          type="datetime-local"
          value={valor ? DateToIsoString(valor) : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ),
    },
    {
      label: "Pai (Carneiro)",
      key: "pai",
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
            defaultValue={parto.pai?.id ?? ""}
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
      key: "mae",
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
            defaultValue={parto.mae?.id ?? ""}
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
          ? `#${valor.id} — ${formatDate(valor.dataGestacao)}`
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
                {`#${g.id}`} — {formatDate(g.dataGestacao)}
              </option>
            ))}
          </select>
        ),
    },
  ];

  const handleSave = async (atualizado: PartoResponseDTO) => {
    if (!atualizado.id) return;
    await PartoService.editar(atualizado.id, {
      ovelhaMaeId: atualizado.mae.id,
      ovelhaPaiId: atualizado.pai?.id,
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
