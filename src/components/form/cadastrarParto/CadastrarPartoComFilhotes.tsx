import React, { useEffect, useState } from "react";
import CadastrarParto from "./CadastrarParto";
import CadastrarOvino from "../cadastrarOvino/CadastrarOvino";
import { toast } from "react-toastify";
import "./CadastrarPartoComFilhotes.css";

const CadastrarPartoComFilhotes: React.FC = () => {
  const [partoId, setPartoId] = useState<number | null>(null);
  const [maeId, setMaeId] = useState<number | null>(null);
  const [paiId, setPaiId] = useState<number | null>(null);
  const [dataPartoISO, setDataPartoISO] = useState<string | null>(null);
  const [restantes, setRestantes] = useState<number>(0);

  const handlePartoSuccess = (
    id: number,
    qtd: number,
    mae: number,
    pai: number,
    dataISO: string
  ) => {
    setPartoId(id);
    setRestantes(qtd);
    setMaeId(mae);
    setPaiId(pai);
    setDataPartoISO(dataISO);
  };

  const handleFilhoteSuccess = () => setRestantes((n) => n - 1);

  useEffect(() => {
    if (partoId && restantes === 0) {
      toast.success(`Todos os filhotes do parto ${partoId} foram cadastrados!`);
    }
  }, [restantes, partoId]);

  if (!partoId) {
    return <CadastrarParto onSuccess={handlePartoSuccess} />;
  }

  if (restantes > 0) {
    return (
      <div className="partoComFilhotes-container flex-column">
        <h3>
          Faltam {restantes} filhote(s) para concluir os cadastros do parto{" "}
          {partoId}
        </h3>
        <CadastrarOvino
          partoId={partoId}
          maeId={maeId ?? undefined}
          paiId={paiId ?? undefined}
          dataNascimento={dataPartoISO ?? undefined}
          onSuccess={handleFilhoteSuccess}
        />
      </div>
    );
  }

  return null;
};

export default CadastrarPartoComFilhotes;
