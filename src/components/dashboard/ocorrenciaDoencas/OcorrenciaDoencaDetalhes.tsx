import React, { useMemo } from "react";
import DetalhesBase, { type CampoConfig } from "../../common/detalhesBase/DetalhesBase";
import { toast } from "react-toastify";

import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import { useDoencas } from "../../../api/hooks/doenca/UseDoencas";
import {
  useEditarOcorrenciaDoenca,
  useRemoverOcorrenciaDoenca,
} from "../../../api/hooks/ocorrenciaDoencas/UseOcorrenciaDoencas";

import type { OcorrenciaDoencaResponseDTO } from "../../../api/dtos/ocorrendiaDoenca/OcorrenciaDoencaResponseDTO";
import type { Ovino } from "../../../api/models/ovino/OvinoModel";
import type { Doenca } from "../../../api/models/doenca/DoencaModel";
import { formatDate } from "../../../utils/formatDate";

interface OcorrenciaDoencaDetalhesProps {
  ocorrencia: OcorrenciaDoencaResponseDTO;
  onClose: () => void;
}

const OcorrenciaDoencaDetalhes: React.FC<OcorrenciaDoencaDetalhesProps> = ({
  ocorrencia,
  onClose,
}) => {
  const { ovinos, loading: loadingOvinos, error: errorOvinos } = useOvinos();
  const { doencas, loading: loadingDoencas, error: errorDoencas } = useDoencas();
  const { editarOcorrencia } = useEditarOcorrenciaDoenca();
  const { removerOcorrencia } = useRemoverOcorrenciaDoenca();

  const campos: CampoConfig<OcorrenciaDoencaResponseDTO>[] = useMemo(
    () => [
      {
        label: "Ovino",
        key: "ovino",
        renderView: (valor) => valor?.nome ?? "—",
        renderEdit: (_, onChange) =>
          loadingOvinos ? (
            <span>Carregando...</span>
          ) : (
            <select
              onChange={(e) => {
                const selected = ovinos?.find(
                  (o) => o.id === Number(e.target.value)
                );
                onChange(selected as Ovino);
              }}
              defaultValue={ocorrencia.ovino?.id ?? ""}
            >
              <option value="">Selecione o ovino...</option>
              {ovinos?.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.nome} • RFID: {o.rfid ?? "—"}
                </option>
              ))}
            </select>
          ),
      },
      {
        label: "Doença",
        key: "doenca",
        renderView: (valor) => valor?.nome ?? "—",
        renderEdit: (_, onChange) =>
          loadingDoencas ? (
            <span>Carregando...</span>
          ) : (
            <select
              onChange={(e) => {
                const selected = doencas?.find(
                  (d) => d.id === Number(e.target.value)
                );
                onChange(selected as Doenca);
              }}
              defaultValue={ocorrencia.doenca?.id ?? ""}
            >
              <option value="">Selecione a doença...</option>
              {doencas?.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.nome}
                </option>
              ))}
            </select>
          ),
      },
      {
        label: "Data de Início",
        key: "dataInicio",
        renderView: (valor) => formatDate(valor, true),
        renderEdit: (valor, onChange) => (
          <input
            type="datetime-local"
            value={valor ? new Date(valor).toISOString().slice(0, 16) : ""}
            onChange={(e) => onChange(e.target.value)}
          />
        ),
      },
      {
        label: "Data Final",
        key: "dataFinal",
        renderView: (valor) =>
          valor ? formatDate(valor, true) : <span style={{ opacity: 0.6 }}>—</span>,
        renderEdit: (valor, onChange) => (
          <input
            type="datetime-local"
            value={valor ? new Date(valor).toISOString().slice(0, 16) : ""}
            onChange={(e) => onChange(e.target.value)}
          />
        ),
      },
    ],
    [ocorrencia, ovinos, doencas, loadingOvinos, loadingDoencas]
  );

  const handleSave = async (atualizado: OcorrenciaDoencaResponseDTO) => {
    if (!atualizado.id) return;

    const isCurado = Boolean(atualizado.dataFinal);

    try {
      await editarOcorrencia(atualizado.id, {
        ovinoId: atualizado.ovino?.id ?? null,
        doencaId: atualizado.doenca?.id ?? null,
        dataInicio: atualizado.dataInicio ?? "",
        dataFinal: atualizado.dataFinal ?? "",
        curado: isCurado,
      });

      toast.success("Ocorrência atualizada com sucesso!");
    } catch {
      toast.error("Erro ao salvar alterações.");
    }
  };

  const handleRemove = async () => {
    if (!ocorrencia.id) return;
    if (!window.confirm("Tem certeza que deseja remover esta ocorrência?")) return;

    try {
      await removerOcorrencia(ocorrencia.id);
      toast.success("Ocorrência removida com sucesso!");
      onClose();
    } catch {
      toast.error("Erro ao remover ocorrência.");
    }
  };

  if (errorOvinos || errorDoencas) {
    return <p style={{ color: "red" }}>{errorOvinos || errorDoencas}</p>;
  }

  return (
    <DetalhesBase
      titulo="Detalhes da Ocorrência de Doença"
      item={ocorrencia}
      campos={campos}
      onSave={handleSave}
      onRemove={handleRemove}
      onClose={onClose}
    />
  );
};

export default OcorrenciaDoencaDetalhes;
