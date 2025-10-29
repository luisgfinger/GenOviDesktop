import React, { useState } from "react";
import "./CadastrarAplicacao.css";
import Button from "../../common/buttons/Button";
import { toast } from "react-toastify";

import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import { useMedicamentos } from "../../../api/hooks/medicamento/UseMedicamentos";
import { useCriarAplicacao } from "../../../api/hooks/aplicacao/UseAplicacoes";

import type { AplicacaoRequestDTO } from "../../../api/dtos/aplicacao/AplicacaoRequestDTO";
import { formatEnum } from "../../../utils/formatEnum";
import { formatDate } from "../../../utils/formatDate";

interface CadastrarAplicacaoProps {
  isVacina: boolean;
}

const CadastrarAplicacao: React.FC<CadastrarAplicacaoProps> = ({
  isVacina,
}) => {
  const { ovinos, loading: loadingOvinos, error: errorOvinos } = useOvinos();
  const {
    medicamentos,
    loading: loadingMed,
    error: errorMed,
  } = useMedicamentos();
  const {
    criarAplicacao,
    loading: saving,
    error: errorSalvar,
  } = useCriarAplicacao();

  const [ovinoId, setOvinoId] = useState<string>("");
  const [medicamentoId, setMedicamentoId] = useState<string>("");
  const [data, setData] = useState<string>("");
  const [enviarSugestao, setEnviarSugestao] = useState<boolean>(false); // ✅ novo estado

  const medicamentosFiltrados = medicamentos.filter(
    (m) => m.isVacina === isVacina
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ovinoId || !medicamentoId || !data) {
      toast.warn("Preencha todos os campos obrigatórios.");
      return;
    }

    const dto: AplicacaoRequestDTO = {
      ovinoId: Number(ovinoId),
      medicamentoId: Number(medicamentoId),
      dataAplicacao: new Date(data).toISOString(),
    };

    try {
      console.log("DTO enviado:", dto);
      console.log("Enviar como sugestão:", enviarSugestao); // apenas para log
      await criarAplicacao(dto);
      toast.success("Aplicação cadastrada com sucesso!");
      setOvinoId("");
      setMedicamentoId("");
      setData("");
      setEnviarSugestao(false);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar aplicação.");
    }
  };

  return (
    <div className="cadastrar-aplicacao-bg flex-column">
      <form
        className="cadastrarAplicacao-container flex-column"
        onSubmit={handleSubmit}
      >
        <ul className="flex-column">
          <li className="flex-column">
            <label htmlFor="ovinoId">Ovino</label>
            {loadingOvinos ? (
              <p>Carregando ovinos...</p>
            ) : errorOvinos ? (
              <p style={{ color: "red" }}>{errorOvinos}</p>
            ) : (
              <select
                id="ovinoId"
                value={ovinoId}
                onChange={(e) => setOvinoId(e.target.value)}
                required
              >
                <option value="">Selecione o ovino...</option>
                {ovinos.map((o) => (
                  <option key={o.id} value={String(o.id)}>
                    {o.nome} • {formatEnum(o.raca)} •{" "}
                    {o.dataNascimento ? formatDate(o.dataNascimento) : "-"}
                  </option>
                ))}
              </select>
            )}
          </li>

          <li className="flex-column">
            <label htmlFor="medicamentoId">
              {isVacina ? "Vacina" : "Medicamento"}
            </label>
            {loadingMed ? (
              <p>Carregando {isVacina ? "vacinas..." : "medicamentos..."}</p>
            ) : errorMed ? (
              <p style={{ color: "red" }}>{errorMed}</p>
            ) : (
              <select
                id="medicamentoId"
                value={medicamentoId}
                onChange={(e) => setMedicamentoId(e.target.value)}
                required
              >
                <option value="">
                  Selecione {isVacina ? "a vacina..." : "o medicamento..."}
                </option>
                {medicamentosFiltrados.map((m) => (
                  <option key={m.id} value={String(m.id)}>
                    {m.nome} • Fabricante: {m.fabricante}
                  </option>
                ))}
              </select>
            )}
          </li>

          <li className="flex-column">
            <label htmlFor="data">Data da aplicação</label>
            <input
              type="datetime-local"
              id="data"
              value={data}
              onChange={(e) => setData(e.target.value)}
              required
            />
          </li>

          <li className="checkbox-sugestao">
            <input
              type="checkbox"
              id="enviarSugestao"
              checked={enviarSugestao}
              onChange={(e) => setEnviarSugestao(e.target.checked)}
            />
            <label htmlFor="enviarSugestao">Enviar como sugestão</label>
          </li>

          <div className="cadastrarAplicacao-form-navigation">
            <Button type="submit" variant="cardPrimary" disabled={saving}>
              {saving ? "Salvando..." : "Cadastrar aplicação"}
            </Button>
          </div>

          {errorSalvar && <p style={{ color: "red" }}>{errorSalvar}</p>}
        </ul>
      </form>
    </div>
  );
};

export default CadastrarAplicacao;
