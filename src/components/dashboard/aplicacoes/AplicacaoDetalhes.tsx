import React, { useMemo } from "react";
import DetalhesBase, { type CampoConfig } from "../../common/detalhesBase/DetalhesBase";
import { toast } from "react-toastify";

import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import { useMedicamentos } from "../../../api/hooks/medicamento/UseMedicamentos";
import {
  useEditarAplicacao,
  useRemoverAplicacao,
} from "../../../api/hooks/aplicacao/UseAplicacoes";

import type { AplicacaoResponseDTO } from "../../../api/dtos/aplicacao/AplicacaoResponseDTO";
import type { Ovino } from "../../../api/models/ovino/OvinoModel";
import type { MedicamentoResponseDTO } from "../../../api/dtos/medicamento/MedicamentoResponseDTO";
import { formatDate } from "../../../utils/formatDate";
import { DateToIsoString } from "../../../utils/dateToIsoString";

interface AplicacaoDetalhesProps {
  aplicacao: AplicacaoResponseDTO;
  isVacina: boolean;
  onClose: () => void;
}

const AplicacaoDetalhes: React.FC<AplicacaoDetalhesProps> = ({
  aplicacao,
  isVacina,
  onClose,
}) => {
  const { ovinos, loading: loadingOvinos, error: errorOvinos } = useOvinos();
  const { medicamentos, loading: loadingMeds, error: errorMeds } = useMedicamentos();
  const { editarAplicacao } = useEditarAplicacao();
  const { removerAplicacao } = useRemoverAplicacao();

  const campos: CampoConfig<AplicacaoResponseDTO>[] = useMemo(
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
              defaultValue={aplicacao.ovino?.id ?? ""}
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
        label: isVacina ? "Vacina" : "Medicamento",
        key: "medicamento",
        renderView: (valor) => valor?.nome ?? "—",
        renderEdit: (_, onChange) =>
          loadingMeds ? (
            <span>Carregando...</span>
          ) : (
            <select
              onChange={(e) => {
                const selected = medicamentos?.find(
                  (m) =>
                    m.id === Number(e.target.value) &&
                    (m.isVacina ?? false) === isVacina
                );
                onChange(selected as MedicamentoResponseDTO);
              }}
              defaultValue={aplicacao.medicamento?.id ?? ""}
            >
              <option value="">
                Selecione {isVacina ? "a vacina" : "o medicamento"}...
              </option>
              {medicamentos
                ?.filter((m) => (m.isVacina ?? false) === isVacina)
                .map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome} • Fabricante: {m.fabricante ?? "—"}
                  </option>
                ))}
            </select>
          ),
      },
      {
        label: "Data da Aplicação",
        key: "dataAplicacao",
        renderView: (valor) => formatDate(valor, true),
        renderEdit: (valor, onChange) => (
          <input
            type="datetime-local"
            value={valor ? DateToIsoString(valor) : ""}
            onChange={(e) => onChange(e.target.value)}
          />
        ),
      },
    ],
    [aplicacao, ovinos, medicamentos, loadingOvinos, loadingMeds, isVacina]
  );

  const handleSave = async (atualizado: AplicacaoResponseDTO) => {
    if (!atualizado.id) return;

    try {
      await editarAplicacao(atualizado.id, {
        ovinoId: atualizado.ovino?.id ?? null,
        medicamentoId: atualizado.medicamento?.id ?? null,
        dataAplicacao: atualizado.dataAplicacao ?? "",
      });

      toast.success("Alterações salvas com sucesso!");
    } catch {
      toast.error("Erro ao salvar alterações.");
    }
  };

  const handleRemove = async () => {
    if (!aplicacao.id) return;
    if (!window.confirm("Tem certeza que deseja remover esta aplicação?")) return;

    try {
      await removerAplicacao(aplicacao.id);
      toast.success(`${isVacina ? "Vacinação" : "Aplicação"} removida com sucesso!`);
      onClose();
    } catch {
      toast.error(`Erro ao remover ${isVacina ? "vacinação" : "aplicação"}.`);
    }
  };

  if (errorOvinos || errorMeds) {
    return <p style={{ color: "red" }}>{errorOvinos || errorMeds}</p>;
  }

  return (
    <DetalhesBase
      titulo={`Detalhes da ${isVacina ? "Vacinação" : "Aplicação"}`}
      item={aplicacao}
      campos={campos}
      onSave={handleSave}
      onRemove={handleRemove}
      onClose={onClose}
    />
  );
};

export default AplicacaoDetalhes;
