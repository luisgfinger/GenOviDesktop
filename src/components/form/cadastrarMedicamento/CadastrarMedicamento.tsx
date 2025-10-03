import React, { useMemo, useState } from "react";
import "./CadastrarMedicamento.css";
import Button from "../../common/buttons/Button";
import { toast } from "react-toastify";

import { useDoencas } from "../../../api/hooks/doenca/UseDoencas";
import { useCriarMedicamento } from "../../../api/hooks/medicamento/UseMedicamentos";

import type { MedicamentoRequestDTO } from "../../../api/dtos/medicamento/MedicamentoRequestDTO";

interface CadastrarMedicamentoProps {
  isVacina: boolean;
}

const CadastrarMedicamento: React.FC<CadastrarMedicamentoProps> = ({ isVacina }) => {
  const { doencas, loading: loadingDoenc, error: errorDoenc } = useDoencas();
  const { criarMedicamento, loading: saving, error: errorSalvar } = useCriarMedicamento();

  const [nome, setNome] = useState("");
  const [fabricante, setFabricante] = useState("");
  const [doencaIds, setDoencaIds] = useState<string[]>([]);
  const [quantidadeDoses, setQuantidadeDoses] = useState<number>(1);
  const [intervaloDoses, setIntervaloDoses] = useState<number>(1);
  const [query, setQuery] = useState("");

  const filteredDoencas = useMemo(() => {
    if (!doencas) return [];
    return doencas.filter((d) =>
      d.nome.toLowerCase().includes(query.toLowerCase())
    );
  }, [doencas, query]);

  const handleToggleDoenca = (id: string) => {
    setDoencaIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleSelectAllFiltered = () => {
    setDoencaIds(filteredDoencas.map((d) => String(d.id)));
  };

  const handleClearSelection = () => {
    setDoencaIds([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome || !fabricante || doencaIds.length === 0) {
      toast.warn("Preencha todos os campos obrigatórios.");
      return;
    }

    const dto: MedicamentoRequestDTO = {
      nome,
      fabricante,
      doencasIds: doencaIds.map(Number),
      quantidadeDoses,
      intervaloDoses,
      isVacina, 
    };

    try {
      console.log("DTO enviado:", dto);
      await criarMedicamento(dto);
      toast.success(`${isVacina ? "Vacina" : "Medicamento"} cadastrado com sucesso!`);

      setNome("");
      setFabricante("");
      setDoencaIds([]);
      setQuantidadeDoses(1);
      setIntervaloDoses(1);
      setQuery("");
    } catch (err) {
      console.error(err);
      toast.error(`Erro ao cadastrar ${isVacina ? "vacina" : "medicamento"}.`);
    }
  };

  return (
    <div className="cadastrar-medicamento-bg flex-column">
      <form
        className="cadastrarMedicamento-container flex-column"
        onSubmit={handleSubmit}
      >
        <ul className="flex-column">
          <li className="flex-column">
            <label htmlFor="nome">{isVacina ? "Nome da Vacina" : "Nome do Medicamento"}</label>
            <input
              type="text"
              id="nome"
              placeholder={`Insira o nome da ${isVacina ? "vacina" : "medicamento"}`}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </li>
          <li className="flex-column">
            <label htmlFor="fabricante">Fabricante</label>
            <input
              type="text"
              id="fabricante"
              placeholder="Insira o fabricante"
              value={fabricante}
              onChange={(e) => setFabricante(e.target.value)}
              required
            />
          </li>
          <li className="medicamento-doencas flex-column">
            {loadingDoenc ? (
              <p>Carregando doenças...</p>
            ) : errorDoenc ? (
              <p style={{ color: "red" }}>{errorDoenc}</p>
            ) : (
              <>
                <div className="medicamento-toolbar flex-column">
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
                      onClick={handleSelectAllFiltered}
                      disabled={filteredDoencas.length === 0}
                    >
                      Selecionar todas
                    </Button>
                    <Button
                      type="button"
                      variant="cardSecondary"
                      onClick={handleClearSelection}
                      disabled={doencaIds.length === 0}
                    >
                      Limpar
                    </Button>
                  </span>
                </div>

                {doencaIds.length > 0 && (
                  <div className="medicamento-chipbar">
                    {doencaIds.map((id) => {
                      const d = doencas?.find((x) => String(x.id) === id);
                      if (!d) return null;
                      return (
                        <span key={id} className="chip">
                          {d.nome}
                          <button
                            type="button"
                            className="chip__close"
                            onClick={() => handleToggleDoenca(id)}
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

                <div className="medicamento-list">
                  {filteredDoencas.length === 0 ? (
                    <p>Nenhuma doença encontrada.</p>
                  ) : (
                    <ul>
                      {filteredDoencas.map((d) => {
                        const idStr = String(d.id);
                        const checked = doencaIds.includes(idStr);
                        return (
                          <li key={d.id} className="medicamento-list-item">
                            <input
                              type="checkbox"
                              id={`doenca-${d.id}`}
                              checked={checked}
                              onChange={() => handleToggleDoenca(idStr)}
                            />
                            <label
                              htmlFor={`doenca-${d.id}`}
                              className="medicamento-list-item__label"
                            >
                              <div className="medicamento-list-item__name">
                                {d.nome}
                              </div>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>

                <div className="medicamento-count">
                  <span>Selecionadas: {doencaIds.length}</span>
                  <span>Filtradas: {filteredDoencas.length}</span>
                  <span>Total cadastradas: {doencas?.length ?? 0}</span>
                </div>
              </>
            )}
          </li>
          <li className="flex-column">
            <label htmlFor="quantidadeDoses">
              {isVacina ? "Número de aplicações" : "Quantidade de doses"}
            </label>
            <input
              type="number"
              id="quantidadeDoses"
              min={1}
              value={quantidadeDoses}
              onChange={(e) => setQuantidadeDoses(Number(e.target.value))}
              required
            />
          </li>
          <li className="flex-column">
            <label htmlFor="intervaloDoses">
              {isVacina ? "Intervalo entre aplicações (dias)" : "Intervalo entre doses (dias)"}
            </label>
            <input
              type="number"
              id="intervaloDoses"
              min={1}
              value={intervaloDoses}
              onChange={(e) => setIntervaloDoses(Number(e.target.value))}
              required
            />
          </li>
          <div className="cadastrarMedicamento-form-navigation">
            <Button type="submit" variant="cardPrimary" disabled={saving}>
              {saving
                ? "Salvando..."
                : `Cadastrar ${isVacina ? "vacina" : "medicamento"}`}
            </Button>
          </div>

          {errorSalvar && <p style={{ color: "red" }}>{errorSalvar}</p>}
        </ul>
      </form>
    </div>
  );
};

export default CadastrarMedicamento;
