import React from "react";
import DetalhesBase, { type CampoConfig } from "../../common/detalhesBase/DetalhesBase";
import type { PesagemResponseDTO } from "../../../api/dtos/pesagem/PesagemResponseDTO";
import { PesagemService } from "../../../api/services/pesagem/PesagemService";
import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import type { Ovino } from "../../../api/models/ovino/OvinoModel";
import { toast } from "react-toastify";
import { formatEnum } from "../../../utils/formatEnum";
import { formatDate } from "../../../utils/formatDate";
import { DateToIsoString } from "../../../utils/dateToIsoString";

interface PesagemDetalhesProps {
  pesagem: PesagemResponseDTO;
  onClose: () => void;
}

const PesagemDetalhes: React.FC<PesagemDetalhesProps> = ({ pesagem, onClose }) => {
  const { ovinos, loading: loadingOvinos } = useOvinos();

  const campos: CampoConfig<PesagemResponseDTO>[] = [
    {
      label: "Data da Pesagem",
      key: "dataPesagem",
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
      label: "Ovino",
      key: "ovino",
      renderView: (valor) =>
        valor
          ? `${valor.nome ?? `#${valor.id}`} • ${formatEnum(valor.raca)}`
          : "—",
      renderEdit: (_, onChange) =>
        loadingOvinos ? (
          <span>Carregando ovinos...</span>
        ) : (
          <select
            onChange={(e) => {
              const selected = ovinos.find((o) => o.id === Number(e.target.value));
              onChange(selected as Ovino);
            }}
            defaultValue={pesagem.ovino?.id ?? ""}
          >
            <option value="">Selecione</option>
            {ovinos.map((o) => (
              <option key={o.id} value={o.id}>
                {o.nome || `#${o.id}`} • {formatEnum(o.raca)} • RFID: {o.rfid ?? "—"}
              </option>
            ))}
          </select>
        ),
    },
    {
      label: "Peso (kg)",
      key: "peso",
      renderView: (valor) => `${valor?.toFixed(2)} kg`,
      renderEdit: (valor, onChange) => (
        <input
          type="number"
          min="0"
          step="0.01"
          value={valor ?? ""}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      ),
    },
  ];

  const handleSave = async (atualizado: PesagemResponseDTO) => {
    if (!atualizado.id) return;

    const dto = {
      ovinoId: atualizado.ovino?.id ?? 0,
      dataPesagem: atualizado.dataPesagem ?? "",
      peso: atualizado.peso ?? 0,
    };

    await PesagemService.editar(atualizado.id, dto);
    toast.success("Alterações salvas com sucesso!");
  };

  const handleRemove = async () => {
    if (!pesagem.id) return;
    await PesagemService.remover(pesagem.id);
    toast.success("Pesagem removida com sucesso!");
  };

  return (
    <DetalhesBase
      titulo="Detalhes da Pesagem"
      item={pesagem}
      campos={campos}
      onSave={handleSave}
      onRemove={handleRemove}
      onClose={onClose}
    />
  );
};

export default PesagemDetalhes;
