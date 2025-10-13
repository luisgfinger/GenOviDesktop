import React, { useMemo } from "react";
import DetalhesBase, { type CampoConfig } from "../../common/detalhesBase/DetalhesBase";
import { toast } from "react-toastify";
import { formatDate } from "../../../utils/formatDate";

import { useFuncionarios } from "../../../api/hooks/funcionario/UseFuncionarios";
import {
  useEditarRegistro,
  useRemoverRegistro,
} from "../../../api/hooks/registro/UseRegistros";

import type { RegistroResponseDTO } from "../../../api/dtos/registro/RegistroResponseDTO";
import type { Funcionario } from "../../../api/models/funcionario/FuncinarioModel";

interface RegistroDetalhesProps {
  registro: RegistroResponseDTO;
  tipo: "aplicacao" | "reproducao" | "gestacao" | "parto" | "ocorrenciaDoenca";
  onClose: () => void;
}

const RegistroDetalhes: React.FC<RegistroDetalhesProps> = ({ registro, tipo, onClose }) => {
  const { funcionarios, loading: loadingFuncs, error: errorFuncs } = useFuncionarios();
  const { editarRegistro } = useEditarRegistro();
  const { removerRegistro } = useRemoverRegistro();

  const tipoDescricao = useMemo(() => {
    switch (tipo) {
      case "aplicacao": return "Aplicação";
      case "reproducao": return "Reprodução";
      case "gestacao": return "Gestação";
      case "parto": return "Parto";
      case "ocorrenciaDoenca": return "Ocorrência de Doença";
      default: return "Registro";
    }
  }, [tipo]);

  const campos: CampoConfig<RegistroResponseDTO>[] = useMemo(
    () => [
      {
        label: "Funcionário Responsável",
        key: "funcionario",
        renderView: (valor) => valor?.nome ?? "—",
        renderEdit: (_, onChange) =>
          loadingFuncs ? (
            <span>Carregando...</span>
          ) : (
            <select
              onChange={(e) => {
                const selected = funcionarios?.find(
                  (f) => f.id === Number(e.target.value)
                );
                onChange(selected as Funcionario);
              }}
              defaultValue={registro.funcionario?.id ?? ""}
            >
              <option value="">Selecione o funcionário...</option>
              {funcionarios?.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.nome}
                </option>
              ))}
            </select>
          ),
      },
      {
        label: "Data do Registro",
        key: "dataRegistro",
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
        label: tipoDescricao,
        key: tipo as keyof RegistroResponseDTO,
        renderView: (valor) => {
          if (!valor) return "—";
          if ("id" in valor) return `#${valor.id}`;
          return JSON.stringify(valor);
        },
        renderEdit: () => (
          <span style={{ color: "#555" }}>
            Este registro está vinculado a uma {tipoDescricao.toLowerCase()} e não pode ser alterado aqui.
          </span>
        ),
      },
    ],
    [registro, funcionarios, loadingFuncs, tipoDescricao, tipo]
  );

  const handleSave = async (atualizado: RegistroResponseDTO) => {
    if (!atualizado.id) return;

    try {
      await editarRegistro(atualizado.id, {
        dataRegistro: atualizado.dataRegistro ?? "",
        funcionarioId: atualizado.funcionario?.id ?? 0,
        aplicacaoId: tipo === "aplicacao" ? atualizado.aplicacao?.id : undefined,
        reproducaoId: tipo === "reproducao" ? atualizado.reproducao?.id : undefined,
        gestacaoId: tipo === "gestacao" ? atualizado.gestacao?.id : undefined,
        partoId: tipo === "parto" ? atualizado.parto?.id : undefined,
        ocorrenciaDoencaId:
          tipo === "ocorrenciaDoenca" ? atualizado.ocorrenciaDoenca?.id : undefined,
      });

      toast.success("Alterações salvas com sucesso!");
    } catch {
      toast.error("Erro ao salvar alterações.");
    }
  };

  const handleRemove = async () => {
    if (!registro.id) return;
    if (!window.confirm(`Tem certeza que deseja remover este registro de ${tipoDescricao.toLowerCase()}?`)) return;

    try {
      await removerRegistro(registro.id);
      toast.success(`Registro de ${tipoDescricao.toLowerCase()} removido com sucesso!`);
      onClose();
    } catch {
      toast.error(`Erro ao remover registro de ${tipoDescricao.toLowerCase()}.`);
    }
  };

  if (errorFuncs) {
    return <p style={{ color: "red" }}>{errorFuncs}</p>;
  }

  return (
    <DetalhesBase
      titulo={`Detalhes do Registro de ${tipoDescricao}`}
      item={registro}
      campos={campos}
      onSave={handleSave}
      onRemove={handleRemove}
      onClose={onClose}
    />
  );
};

export default RegistroDetalhes;
