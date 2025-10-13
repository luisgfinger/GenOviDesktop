import React, { useEffect, useState } from "react";
import CadastrarCompra from "./CadastrarCompra";
import CadastrarOvino from "../cadastrarOvino/CadastrarOvino";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./CadastrarCompraComOvinos.css";

const CadastrarCompraComOvinos: React.FC = () => {
  const [compraId, setCompraId] = useState<number | null>(null);
  const [dataCompraISO, setDataCompraISO] = useState<string | null>(null);
  const [restantes, setRestantes] = useState<number>(0);

  const navigate = useNavigate();

  const handleCompraSuccess = (id: number, qtd: number, dataISO: string) => {
    setCompraId(id);
    setRestantes(qtd);
    setDataCompraISO(dataISO);
  };

  const handleOvinoSuccess = () => setRestantes((n) => n - 1);

  useEffect(() => {
    if (compraId && restantes === 0) {
      toast.success(`Todos os ovinos da compra ${compraId} foram cadastrados!`);
      navigate("/dashboard/ovinos/gerenciar");
    }
  }, [restantes, compraId, navigate]);

  if (!compraId) {
    return <CadastrarCompra onSuccess={handleCompraSuccess} />;
  }

  if (restantes > 0) {
    return (
      <div className="compraComOvinos-container flex-column">
        <h3>
          Faltam {restantes} ovino(s) para concluir os cadastros da compra{" "}
          {compraId}
        </h3>
        <CadastrarOvino
          compraId={compraId}
          dataNascimento={dataCompraISO ?? undefined}
          onSuccess={handleOvinoSuccess}
        />
      </div>
    );
  }

  return null;
};

export default CadastrarCompraComOvinos;
