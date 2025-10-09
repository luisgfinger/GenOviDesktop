import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DetalhesBase, { type CampoConfig } from "../../common/detalhesBase/DetalhesBase";
import { MedicamentoService } from "../../../api/services/medicamento/MedicamentoService";
import type { MedicamentoResponseDTO } from "../../../api/dtos/medicamento/MedicamentoResponseDTO";
import { DoencaService } from "../../../api/services/doenca/DoencaService";
import Button from "../../common/buttons/Button";
import "./MedicamentoDetalhes.css";

interface MedicamentoDetalhesProps {
  medicamento: MedicamentoResponseDTO;
  onClose: () => void;
}

const MedicamentoDetalhes: React.FC<MedicamentoDetalhesProps> = ({
  medicamento,
  onClose,
}) => {
  const [doencas, setDoencas] = useState<any[]>([]);
  const [loadingDoenc, setLoadingDoenc] = useState(false);
  const [errorDoenc, setErrorDoenc] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [doencaIds, setDoencaIds] = useState<string[]>(
    medicamento.doencas?.map((d) => String(d.id)) ?? []
  );

  useEffect(() => {
    const fetchDoencas = async () => {
      try {
        setLoadingDoenc(true);
        const data = await DoencaService.listarTodos();
        setDoencas(data);
      } catch (err) {
        console.error(err);
        setErrorDoenc("Erro ao carregar doenças.");
      } finally {
        setLoadingDoenc(false);
      }
    };
    fetchDoencas();
  }, []);


  const filteredDoencas = doencas.filter(
    (d) =>
      d.nome.toLowerCase().includes(query.toLowerCase()) ||
      d.descricao?.toLowerCase().includes(query.toLowerCase())
  );

  const handleToggleDoenca = (id: string) => {
    setDoencaIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    setDoencaIds(Array.from(new Set([...doencaIds, ...filteredDoencas.map((d) => String(d.id))])));
  };

  const handleClearSelection = () => {
    setDoencaIds([]);
  };

  const campos: CampoConfig<MedicamentoResponseDTO>[] = [
    { label: "Nome", key: "nome" },
    { label: "Fabricante", key: "fabricante" },
    {
      label: "Quantidade de Doses",
      key: "quantidadeDoses",
      renderEdit: (valor, onChange) => (
        <input
          type="number"
          min={1}
          value={valor ?? ""}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      ),
    },
    {
      label: "Intervalo entre Doses (dias)",
      key: "intervaloDoses",
      renderEdit: (valor, onChange) => (
        <input
          type="number"
          min={0}
          value={valor ?? ""}
          onChange={(e) => onChange(Number(e.target.value))}
        />
      ),
    },
    {
      label: "Tipo",
      key: "isVacina",
      renderView: (valor) => (valor ? "Vacina" : "Medicamento Comum"),
      renderEdit: (valor, onChange) => (
        <select
          value={valor ? "true" : "false"}
          onChange={(e) => onChange(e.target.value === "true")}
        >
          <option value="false">Medicamento Comum</option>
          <option value="true">Vacina</option>
        </select>
      ),
    },
    {
      label: "Doenças Tratadas",
      key: "doencas",
      renderView: (valor) =>
        valor && valor.length > 0 ? (
          <ul>
            {valor.map((d: any) => (
              <li key={d.id}>{d.nome}</li>
            ))}
          </ul>
        ) : (
          "—"
        ),

      renderEdit: (valor, onChange) => (
        <li className="medicamento-doencas2 flex-column">
          {loadingDoenc ? (
            <p>Carregando doenças...</p>
          ) : errorDoenc ? (
            <p style={{ color: "red" }}>{errorDoenc}</p>
          ) : (
            <>
              <div className="medicamento-toolbar2 flex-column">
                <label htmlFor="doencasSearch">Doenças tratadas</label>
                <input
                  id="doencasSearch"
                  type="text"
                  placeholder="Buscar por nome ou descrição…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <span className="flex">
                  <Button
                    type="button"
                    variant="cardSecondary"
                    onClick={() => {
                      handleSelectAllFiltered();
                      const novasSelecionadas = doencas.filter((x) =>
                        [...doencaIds, ...filteredDoencas.map((d) => String(d.id))].includes(String(x.id))
                      );
                      onChange(novasSelecionadas);
                    }}
                    disabled={filteredDoencas.length === 0}
                  >
                    Selecionar todas
                  </Button>
                  <Button
                    type="button"
                    variant="cardSecondary"
                    onClick={() => {
                      handleClearSelection();
                      onChange([]);
                    }}
                    disabled={doencaIds.length === 0}
                  >
                    Limpar
                  </Button>
                </span>
              </div>

              {doencaIds.length > 0 && (
                <div className="medicamento-chipbar2">
                  {doencaIds.map((id) => {
                    const d = doencas.find((x) => String(x.id) === id);
                    if (!d) return null;
                    return (
                      <span key={id} className="chip2">
                        {d.nome}
                        <button
                          type="button"
                          className="chip__close2"
                          onClick={() => {
                            handleToggleDoenca(id);
                            const novasSelecionadas = doencas.filter((x) =>
                              doencaIds.filter((v) => v !== id).includes(String(x.id))
                            );
                            onChange(novasSelecionadas);
                          }}
                          aria-label={`Remover ${d.nome}`}
                          title="Remover"
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}

              <div className="medicamento-list2">
                {filteredDoencas.length === 0 ? (
                  <p>Nenhuma doença encontrada.</p>
                ) : (
                  <ul>
                    {filteredDoencas.map((d) => {
                      const idStr = String(d.id);
                      const checked = doencaIds.includes(idStr);
                      return (
                        <li key={d.id} className="medicamento-list-item2">
                          <input
                            type="checkbox"
                            id={`doenca-${d.id}`}
                            checked={checked}
                            onChange={() => {
                              handleToggleDoenca(idStr);
                              const novasSelecionadas = doencas.filter((x) =>
                                (checked
                                  ? doencaIds.filter((v) => v !== idStr)
                                  : [...doencaIds, idStr]
                                ).includes(String(x.id))
                              );
                              onChange(novasSelecionadas);
                            }}
                          />
                          <label
                            htmlFor={`doenca-${d.id}`}
                            className="medicamento-list-item__label2"
                          >
                            <div className="medicamento-list-item__name2">
                              {d.nome}
                            </div>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>

              <div className="medicamento-count2">
                <span>Selecionadas: {doencaIds.length}</span>
                <span>Filtradas: {filteredDoencas.length}</span>
                <span>Total cadastradas: {doencas.length}</span>
              </div>
            </>
          )}
        </li>
      ),
    },
  ];

  const handleSave = async (atualizado: MedicamentoResponseDTO) => {
    if (!atualizado.id) return;
    try {
      const dto = {
        nome: atualizado.nome,
        fabricante: atualizado.fabricante,
        quantidadeDoses: atualizado.quantidadeDoses,
        intervaloDoses: atualizado.intervaloDoses,
        isVacina: atualizado.isVacina,
        doencasIds: doencaIds.map(Number),
      };

      await MedicamentoService.atualizar(atualizado.id, dto);
      toast.success("Alterações salvas com sucesso!");
    } catch (err) {
      console.error(err);
      toast.error("Erro ao salvar alterações.");
      throw err;
    }
  };

  const handleRemove = async () => {
    if (!medicamento.id) return;
    await MedicamentoService.remover(medicamento.id);
  };

  return (
    <DetalhesBase
      titulo="Detalhes do Medicamento"
      item={medicamento}
      campos={campos}
      onSave={handleSave}
      onRemove={handleRemove}
      onClose={onClose}
    />
  );
};

export default MedicamentoDetalhes;
