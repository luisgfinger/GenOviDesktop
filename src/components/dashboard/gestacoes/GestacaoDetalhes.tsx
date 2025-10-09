import React, { useMemo } from "react";
import DetalhesBase, { type CampoConfig } from "../../common/detalhesBase/DetalhesBase";
import type { GestacaoResponseDTO } from "../../../api/dtos/gestacao/GestacaoResponseDTO";
import { GestacaoService } from "../../../api/services/gestacao/GestacaoService";
import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import { useReproducoes } from "../../../api/hooks/reproducao/UseReproducoes";
import type { Ovino } from "../../../api/models/ovino/OvinoModel";
import type { ReproducaoResponseDTO } from "../../../api/dtos/reproducao/ReproducaoResponseDTO";
import { toast } from "react-toastify";
import { TypeSexo } from "../../../api/enums/typeSexo/TypeSexo";
import { TypeReproducao } from "../../../api/enums/typeReproducao/TypeReproducao";
import { formatEnum } from "../../../utils/formatEnum";

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
  const { ovinos, loading: loadingOvinos } = useOvinos();
  const { reproducoes, loading: loadingReproducao } = useReproducoes();

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

  const campos: CampoConfig<GestacaoResponseDTO>[] = [
    {
      label: "Data da Gestação",
      key: "dataGestacao",
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
      label: "Pai",
      key: "ovelhaPai",
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
              onChange(selected as Ovino);
            }}
            defaultValue={gestacao.ovelhaPai?.id ?? ""}
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
      label: "Mãe",
      key: "ovelhaMae",
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
              onChange(selected as Ovino);
            }}
            defaultValue={gestacao.ovelhaMae?.id ?? ""}
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
      label: "Reprodução vinculada",
      key: "reproducao",
      renderView: (valor) =>
        valor?.id
          ? `#${valor.id} — ${
              valor.typeReproducao
                ? formatEnum(valor.typeReproducao as TypeReproducao)
                : "Sem tipo"
            }`
          : "—",
      renderEdit: (_, onChange) =>
        loadingReproducao ? (
          <span>Carregando reproduções...</span>
        ) : (
          <select
            onChange={(e) => {
              const selected = reproducoes.find(
                (r) => r.id === Number(e.target.value)
              );
              onChange(selected as ReproducaoResponseDTO);
            }}
            defaultValue={gestacao.reproducao?.id ?? ""}
          >
            <option value="">Selecione</option>
            {reproducoes.map((r) => (
              <option key={r.id} value={r.id}>
                {`#${r.id}`} —{" "}
                {r.typeReproducao
                  ? formatEnum(r.typeReproducao as TypeReproducao)
                  : "Sem tipo"}
              </option>
            ))}
          </select>
        ),
    },
  ];

  const handleSave = async (atualizado: GestacaoResponseDTO) => {
    if (!atualizado.id) return;
    const dto = {
      ovelhaMaeId: atualizado.ovelhaMae?.id,
      ovelhaPaiId: atualizado.ovelhaPai?.id,
      dataGestacao: atualizado.dataGestacao ?? "",
      reproducaoId: atualizado.reproducao?.id ?? undefined,
    };

    await GestacaoService.editar(atualizado.id, dto);
    toast.success("Alterações salvas com sucesso!");
  };

  const handleRemove = async () => {
    if (!gestacao.id) return;
    await GestacaoService.remover(gestacao.id);
  };

  return (
    <DetalhesBase
      titulo="Detalhes da Gestação"
      item={gestacao}
      campos={campos}
      onSave={handleSave}
      onRemove={handleRemove}
      onClose={onClose}
    />
  );
};

export default GestacaoDetalhes;
