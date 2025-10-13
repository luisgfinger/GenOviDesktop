import React, { useState } from "react";
import "./CadastrarCompra.css";
import Button from "../../common/buttons/Button";
import { toast } from "react-toastify";

import { useCriarCompra } from "../../../api/hooks/compra/UseCompras";
import type { CompraRequestDTO } from "../../../api/dtos/compra/CompraRequestDTO";

interface CadastrarCompraProps {
  onSuccess?: (compraId: number, qtdOvinos: number, dataCompraISO: string) => void;
}

const CadastrarCompra: React.FC<CadastrarCompraProps> = ({ onSuccess }) => {
  const { criarCompra, loading, error } = useCriarCompra();

  const [dataCompra, setDataCompra] = useState("");
  const [valor, setValor] = useState("");
  const [vendedorId, setVendedorId] = useState("");
  const [qtdOvinos, setQtdOvinos] = useState(1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!dataCompra || !valor) {
      toast.warn("Preencha a data e o valor da compra!");
      return;
    }

    const dto: CompraRequestDTO = {
      dataCompra: new Date(dataCompra).toISOString(),
      valor: parseFloat(valor),
      vendedorId: vendedorId ? Number(vendedorId) : undefined,
    };

    try {
      const compraCriada = await criarCompra(dto);
      toast.success("Compra registrada com sucesso!");

      onSuccess?.(compraCriada.id, qtdOvinos, dto.dataCompra);
      setDataCompra("");
      setValor("");
      setVendedorId("");
      setQtdOvinos(1);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao registrar compra.");
    }
  };

  return (
    <div className="cadastrar-compra-bg flex-column">
      <form className="cadastrarCompra-container flex-column" onSubmit={handleSubmit}>
        <ul className="flex-column">
          <li className="flex-column">
            <label htmlFor="dataCompra">Data da compra</label>
            <input
              id="dataCompra"
              type="datetime-local"
              value={dataCompra}
              onChange={(e) => setDataCompra(e.target.value)}
              required
            />
          </li>

          <li className="flex-column">
            <label htmlFor="valor">Valor total (R$)</label>
            <input
              id="valor"
              type="number"
              min={0}
              step="0.01"
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              required
              placeholder="Insira o valor em Reais"
            />
          </li>

          <li className="flex-column">
            <label htmlFor="vendedorId">Vendedor (opcional)</label>
            <input
              id="vendedorId"
              type="number"
              min={1}
              value={vendedorId}
              onChange={(e) => setVendedorId(e.target.value)}
              placeholder="ID do vendedor"
            />
          </li>

          <li className="flex-column">
            <label htmlFor="qtdOvinos">Quantidade de ovinos comprados</label>
            <input
              id="qtdOvinos"
              type="number"
              min={1}
              value={qtdOvinos}
              onChange={(e) => setQtdOvinos(Number(e.target.value))}
              required
            />
          </li>

          <div className="cadastrarCompra-form-navigation">
            <Button type="submit" variant="cardPrimary" disabled={loading}>
              {loading ? "Salvando..." : "Registrar compra"}
            </Button>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}
        </ul>
      </form>
    </div>
  );
};

export default CadastrarCompra;
