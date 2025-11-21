import React, { useEffect, useMemo, useState } from "react";
import "./CadastrarReproducao.css";
import Button from "../../common/buttons/Button";
import { toast } from "react-toastify";

import { TypeSexo } from "../../../api/enums/typeSexo/TypeSexo";
import { TypeStatus } from "../../../api/enums/typeStatus/TypeStatus";
import { TypeReproducao } from "../../../api/enums/typeReproducao/TypeReproducao";
import { formatEnum } from "../../../utils/formatEnum";

import { useOvinos } from "../../../api/hooks/ovino/UseOvinos";
import { useCriarReproducao } from "../../../api/hooks/reproducao/UseReproducoes";
import { useGestacoes } from "../../../api/hooks/gestacao/UseGestacoes";
import { usePartos } from "../../../api/hooks/parto/UsePartos";

import type { ReproducaoRequestDTO } from "../../../api/dtos/reproducao/ReproducaoRequestDTO";
import { formatDate } from "../../../utils/formatDate";
import { createRegistroAuto } from "../../../utils/criarRegistro";
import IAButton from "../../common/ia/IAButton";

type Props = {
  minAgeMonths?: number;
};

function diffMonthsFromNow(iso?: string): number {
  if (!iso) return 0;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return 0;
  const now = new Date();
  const years = now.getFullYear() - d.getFullYear();
  const months = years * 12 + (now.getMonth() - d.getMonth());
  const adjust = now.getDate() >= d.getDate() ? 0 : -1;
  return months + adjust;
}

const CadastrarReproducao: React.FC<Props> = ({ minAgeMonths = 12 }) => {
  const { ovinos } = useOvinos();
  const { criarReproducao, loading: saving, error: errorSalvar } = useCriarReproducao();
  const { gestacoes } = useGestacoes();
  const { partos } = usePartos();

  const [carneiroId, setCarneiroId] = useState<string>("");
  const [femeaId, setFemeaId] = useState<string>("");
  const [typeReproducao, setTypeReproducao] = useState<TypeReproducao | "">("");
  const [dataReproducao, setDataReproducao] = useState<string>("");
  const [enviarSugestao, setEnviarSugestao] = useState<boolean>(false);
  const [contextoIA, setContextoIA] = useState<any>(null);

  const isOvelhaGestando = (ovelhaId: number): boolean => {
    return (gestacoes ?? []).some((g) => {
      const maeId = g.ovelhaMae?.id;
      const partoVinculado = (partos ?? []).some(
        (p) => p.gestacao?.id === g.id
      );
      return maeId === ovelhaId && !partoVinculado;
    });
  };

  const adultosAtivos = useMemo(
    () =>
      (ovinos ?? []).filter(
        (o) =>
          o.status === TypeStatus.ATIVO &&
          diffMonthsFromNow(o.dataNascimento) >= minAgeMonths
      ),
    [ovinos, minAgeMonths]
  );

  const machosAdultos = useMemo(
    () => adultosAtivos.filter((o) => o.sexo === TypeSexo.MACHO),
    [adultosAtivos]
  );

  const femeasAdultas = useMemo(
    () =>
      (adultosAtivos ?? [])
        .filter(
          (o) =>
            o.sexo === TypeSexo.FEMEA &&
            String(o.id) !== carneiroId &&
            !isOvelhaGestando(o.id)
        )
        .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR")),
    [adultosAtivos, carneiroId, gestacoes, partos]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!carneiroId || !femeaId || !typeReproducao || !dataReproducao) {
      toast.warn("Preencha macho, fêmea, tipo e data da reprodução.");
      return;
    }

    const dto: ReproducaoRequestDTO = {
      carneiroId: Number(carneiroId),
      ovelhaId: Number(femeaId),
      enumReproducao: typeReproducao as TypeReproducao,
      dataReproducao: `${dataReproducao}:00`,
    };

    try {
      const novaReproducao = await criarReproducao(dto);

      const reproducaoFormatada = {
        ...novaReproducao,
        enumReproducao: novaReproducao.enumReproducao as TypeReproducao,
      };

      await createRegistroAuto("reproducao", reproducaoFormatada, enviarSugestao);

      toast.success("Reprodução criada com sucesso!");

      setFemeaId("");
      setCarneiroId("");
      setTypeReproducao("");
      setDataReproducao("");
      setEnviarSugestao(false);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao cadastrar reprodução.");
    }
  };

  useEffect(() => {
    const macho = machosAdultos.find((m) => String(m.id) === carneiroId);
    const femea = femeasAdultas.find((f) => String(f.id) === femeaId);

    setContextoIA(macho && femea ? { macho, femea } : null);
  }, [carneiroId, femeaId, machosAdultos, femeasAdultas]);

  return (
    <div className="cadastrar-reproducao-bg flex-column">
      <form className="cadastrarReproducao-container flex-column" onSubmit={handleSubmit}>
        <ul className="flex-column">
          <li className="flex-column">
            <label htmlFor="carneiroId">Macho</label>
            <select
              id="carneiroId"
              value={carneiroId}
              onChange={(e) => setCarneiroId(e.target.value)}
            >
              <option value="">Selecione o macho adulto...</option>
              {machosAdultos.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.nome} • {formatEnum(o.raca)} • {formatDate(o.dataNascimento ?? "-")}
                </option>
              ))}
            </select>
          </li>
          <li className="flex-column">
            <label htmlFor="femeaId">Fêmea</label>
            <select
              id="femeaId"
              value={femeaId}
              onChange={(e) => setFemeaId(e.target.value)}
            >
              <option value="">Selecione a fêmea...</option>
              {femeasAdultas.map((o) => (
                <option key={o.id} value={String(o.id)}>
                  {o.nome} • {formatEnum(o.raca)} • {formatDate(o.dataNascimento ?? "-")}
                </option>
              ))}
            </select>
          </li>
          <li className="flex-column">
            <label htmlFor="typeReproducao">Tipo de Reprodução</label>
            <select
              id="typeReproducao"
              value={typeReproducao}
              onChange={(e) => setTypeReproducao(e.target.value as TypeReproducao)}
            >
              <option value="">Selecione...</option>
              {Object.values(TypeReproducao).map((t) => (
                <option key={t} value={t}>
                  {formatEnum(t)}
                </option>
              ))}
            </select>
          </li>
          <li className="flex-column">
            <label htmlFor="dataReproducao">Data/Hora da Reprodução</label>
            <input
              type="datetime-local"
              id="dataReproducao"
              value={dataReproducao}
              onChange={(e) => setDataReproducao(e.target.value)}
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

          <div className="cadastrarReproducao-form-navigation">
            <Button type="submit" variant="cardPrimary" disabled={saving}>
              {saving ? "Salvando..." : "Cadastrar reprodução"}
            </Button>
          </div>

          {errorSalvar && <p style={{ color: "red" }}>{errorSalvar}</p>}
        </ul>
      </form>

      <IAButton
        promptPreDefinido="Avaliação da reprodução:"
        permitirInputUsuario={true}
        promptOptions={[
          "Esta combinação genética é boa?",
          "A fêmea pode reproduzir neste momento?",
          "Existe risco nessa reprodução?",
          "O macho é adequado para cobertura?",
          "Previsão de características dos cordeiros",
        ]}
        contextoIA={contextoIA}
      />
    </div>
  );
};

export default CadastrarReproducao;
