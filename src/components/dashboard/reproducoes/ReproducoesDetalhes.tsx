import React, { useMemo } from "react";
import DetalhesBase, { type CampoConfig } from "../../common/detalhesBase/DetalhesBase";
import type { ReproducaoResponseDTO } from "../../../api/dtos/reproducao/ReproducaoResponseDTO";
import { ReproducaoService } from "../../../api/services/reproducao/ReproducaoService";
import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import { TypeReproducao } from "../../../api/enums/typeReproducao/TypeReproducao";
import { formatEnum } from "../../../utils/formatEnum";
import { toast } from "react-toastify";
import type { Ovino } from "../../../api/models/ovino/OvinoModel";
import { TypeSexo } from "../../../api/enums/typeSexo/TypeSexo";

interface ReproducaoDetalhesProps {
  reproducao: ReproducaoResponseDTO;
  onClose: () => void;
}

const ReproducaoDetalhes: React.FC<ReproducaoDetalhesProps> = ({
  reproducao,
  onClose,
}) => {
  const { ovinos, loading: loadingOvinos } = useOvinos();

  const machos = useMemo(
    () => (ovinos ?? []).filter((o) => o.sexo === TypeSexo.MACHO),
    [ovinos]
  );
  const femeas = useMemo(
    () => (ovinos ?? []).filter((o) => o.sexo === TypeSexo.FEMEA),
    [ovinos]
  );

  const campos: CampoConfig<ReproducaoResponseDTO>[] = [
    {
      label: "Tipo de Reprodução",
      key: "typeReproducao",
      renderView: (valor) =>
        valor ? formatEnum(valor as TypeReproducao) : "—",
      renderEdit: (valor, onChange) => (
        <select value={valor ?? ""} onChange={(e) => onChange(e.target.value)}>
          <option value="">Selecione</option>
          {Object.values(TypeReproducao).map((tipo) => (
            <option key={tipo} value={tipo}>
              {formatEnum(tipo as TypeReproducao)}
            </option>
          ))}
        </select>
      ),
    },
    {
      label: "Data da Reprodução",
      key: "dataReproducao",
      renderView: (valor) =>
        valor ? new Date(valor).toLocaleString() : "—",
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
      key: "carneiroPai",
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
            defaultValue={reproducao.carneiroPai?.id ?? ""}
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
            defaultValue={reproducao.ovelhaMae?.id ?? ""}
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
      label: "Observações",
      key: "observacoes",
      renderView: (valor) => (
        <span className="text-breaker">{valor ?? "—"}</span>
      ),
      renderEdit: (valor, onChange) => (
        <textarea
          value={valor ?? ""}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          placeholder="Anotações adicionais"
          maxLength={255}
        />
      ),
    },
  ];

  const handleSave = async (atualizado: ReproducaoResponseDTO) => {
    if (!atualizado.id) return;

    await ReproducaoService.editar(atualizado.id, {
      carneiroId: atualizado.carneiroPai?.id ?? null,
      ovelhaId: atualizado.ovelhaMae?.id ?? null,
      typeReproducao: atualizado.typeReproducao ?? "",
      dataReproducao: atualizado.dataReproducao ?? "",
      observacoes: atualizado.observacoes ?? "",
    });

    toast.success("Alterações salvas com sucesso!");
  };

  const handleRemove = async () => {
    if (!reproducao.id) return;
    await ReproducaoService.remover(reproducao.id);
    toast.success("Reprodução removida com sucesso!");
  };

  return (
    <DetalhesBase
      titulo="Detalhes da Reprodução"
      item={reproducao}
      campos={campos}
      onSave={handleSave}
      onRemove={handleRemove}
      onClose={onClose}
    />
  );
};

export default ReproducaoDetalhes;
