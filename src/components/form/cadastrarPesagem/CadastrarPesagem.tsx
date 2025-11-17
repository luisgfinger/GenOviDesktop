import React, { useState } from "react";
import "./CadastrarPesagem.css";
import Button from "../../common/buttons/Button";
import { toast } from "react-toastify";

import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import { useCriarPesagem } from "../../../api/hooks/pesagem/UsePesagens";

import { formatEnum } from "../../../utils/formatEnum";
import { formatDate } from "../../../utils/formatDate";
import { DateToIsoString } from "../../../utils/dateToIsoString";

import type { PesagemRequestDTO } from "../../../api/dtos/pesagem/PesagemRequestDTO";
import { useNavigate } from "react-router-dom";
import { createRegistroAuto } from "../../../utils/criarRegistro";

const CadastrarPesagem: React.FC = () => {
  const { ovinos, loading: loadingOvinos, error: errorOvinos } = useOvinos();
  const { criarPesagem, loading: saving, error: errorSalvar } = useCriarPesagem();

  const [ovinoId, setOvinoId] = useState<string>("");
  const [peso, setPeso] = useState<string>("");
  const [dataPesagem, setDataPesagem] = useState<string>("");
  const [enviarSugestao, setEnviarSugestao] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ovinoId || !peso || !dataPesagem) {
      toast.warn("Preencha todos os campos obrigatórios.");
      return;
    }

    const dto: PesagemRequestDTO = {
      ovinoId: Number(ovinoId),
      dataPesagem: DateToIsoString(dataPesagem),
      peso: Number(peso),
    };

    try {
      const novaPesagem = await criarPesagem(dto);

      await createRegistroAuto("pesagem", novaPesagem, enviarSugestao);
      toast.success(
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            gap: "16px",
            alignItems: "center",
          }}
        >
          <span>Pesagem registrada com sucesso!</span>

          <Button
            type="button"
            variant="toast"
            onClick={() => {
              const destino = `/dashboard/ovinos/pesagens/gerenciar?searchId=${novaPesagem.id}`;
              navigate(destino);
              toast.dismiss();
            }}
          >
            Visualizar agora
          </Button>
        </div>,
        {
          autoClose: 6000,
          style: { width: "440px" },
        }
      );

      setOvinoId("");
      setPeso("");
      setDataPesagem("");
      setEnviarSugestao(false);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao registrar pesagem.");
    }
  };

  return (
    <div className="cadastrar-pesagem-bg flex-column">
      <form className="cadastrarPesagem-container flex-column" onSubmit={handleSubmit}>
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
                {(ovinos ?? []).map((o) => (
                  <option key={o.id} value={String(o.id)}>
                    {o.nome} • {formatEnum(o.raca)} • {formatDate(o.dataNascimento ?? "-")}
                  </option>
                ))}
              </select>
            )}
          </li>

          <li className="flex-column">
            <label htmlFor="peso">Peso (kg)</label>
            <input
              type="number"
              id="peso"
              min="0"
              step="0.01"
              value={peso}
              onChange={(e) => setPeso(e.target.value)}
              placeholder="Ex: 52.4"
              required
            />
          </li>

          <li className="flex-column">
            <label htmlFor="dataPesagem">Data da pesagem</label>
            <input
              type="datetime-local"
              id="dataPesagem"
              value={dataPesagem}
              onChange={(e) => setDataPesagem(e.target.value)}
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
            <label htmlFor="enviarSugestao">Enviar como solicitação</label>
          </li>

          <div className="cadastrarPesagem-form-navigation">
            <Button type="submit" variant="cardPrimary" disabled={saving}>
              {saving ? "Salvando..." : "Registrar pesagem"}
            </Button>
          </div>

          {errorSalvar && <p style={{ color: "red" }}>{errorSalvar}</p>}
        </ul>
      </form>
    </div>
  );
};

export default CadastrarPesagem;
