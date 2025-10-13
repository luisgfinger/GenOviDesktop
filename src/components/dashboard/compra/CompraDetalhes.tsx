import React from "react";
import DetalhesBase, { type CampoConfig } from "../../common/detalhesBase/DetalhesBase";
import type { CompraResponseDTO } from "../../../api/dtos/compra/CompraResponseDTO";
import { CompraService } from "../../../api/services/compra/CompraService";
import { useVendedores } from "../../../api/hooks/vendedor/UseVendedores";

function formatISODateTime(iso?: string) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  const dia = d.toLocaleDateString();
  const hora = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return `${dia} ${hora}`;
}

interface CompraDetalhesProps {
  compra: CompraResponseDTO;
  onClose: () => void;
}

const CompraDetalhes: React.FC<CompraDetalhesProps> = ({ compra, onClose }) => {
  const { vendedores, loading: loadingVendedores, error: errorVendedores } = useVendedores();

  const campos: CampoConfig<CompraResponseDTO>[] = [
    {
      label: "Data da Compra",
      key: "dataCompra",
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
      label: "Valor Total (R$)",
      key: "valor",
      renderView: (valor) => `R$ ${Number(valor ?? 0).toFixed(2)}`,
      renderEdit: (valor, onChange) => (
        <input
          type="number"
          step="0.01"
          min="0"
          value={valor ?? 0}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      ),
    },
    {
      label: "Vendedor",
      key: "vendedor",
      renderView: (valor) => valor?.nome ?? "—",
      renderEdit: (_, onChange) =>
        loadingVendedores ? (
          <span>Carregando...</span>
        ) : errorVendedores ? (
          <span style={{ color: "red" }}>{errorVendedores}</span>
        ) : (
          <select
            defaultValue={compra.vendedor?.id ?? ""}
            onChange={(e) => {
              const selected = vendedores.find((v) => v.id === Number(e.target.value));
              onChange(selected);
            }}
          >
            <option value="">Selecione um vendedor...</option>
            {vendedores.map((v) => (
              <option key={v.id} value={v.id}>
                {v.nome || `#${v.id}`} — {v.telefone ?? "sem telefone"}
              </option>
            ))}
          </select>
        ),
    },
  ];

  const handleSave = async (atualizado: CompraResponseDTO) => {
    if (!atualizado.id) return;
    await CompraService.editar(atualizado.id, {
      dataCompra: atualizado.dataCompra ?? new Date().toISOString(),
      valor: atualizado.valor ?? 0,
      vendedorId: atualizado.vendedor?.id ?? undefined,
    });
  };

  const handleRemove = async () => {
    if (!compra.id) return;
    await CompraService.remover(compra.id);
    onClose();
  };

  return (
    <DetalhesBase
      titulo="Detalhes da Compra"
      item={compra}
      campos={campos}
      onSave={handleSave}
      onRemove={handleRemove}
      onClose={onClose}
    />
  );
};

export default CompraDetalhes;
