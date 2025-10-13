import { useEffect, useState } from "react";
import { CompraService } from "../../services/compra/CompraService";
import type { Compra } from "../../models/compra/CompraModel";
import type { CompraRequestDTO } from "../../dtos/compra/CompraRequestDTO";

export function useCompras() {
  const [compras, setCompras] = useState<Compra[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await CompraService.listarTodos();
        setCompras(data);
      } catch (err) {
        console.error("Erro ao buscar compras:", err);
        setError("Não foi possível carregar as compras.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { compras, loading, error };
}

export function useCompra(id: number | null) {
  const [compra, setCompra] = useState<Compra | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setLoading(false);
      setError("ID inválido para buscar compra.");
      return;
    }

    const fetchCompra = async () => {
      try {
        const data = await CompraService.buscarPorId(id);
        setCompra(data);
      } catch (err) {
        console.error("Erro ao carregar compra:", err);
        setError("Não foi possível carregar a compra.");
      } finally {
        setLoading(false);
      }
    };

    fetchCompra();
  }, [id]);

  return { compra, loading, error };
}

export function useCriarCompra() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [novaCompra, setNovaCompra] = useState<Compra | null>(null);

  const criarCompra = async (dto: CompraRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const created = await CompraService.criar(dto);
      setNovaCompra(created);
      return created;
    } catch (err) {
      console.error("Erro ao cadastrar compra:", err);
      setError("Não foi possível cadastrar a compra.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { criarCompra, novaCompra, loading, error };
}

export function useEditarCompra() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compraEditada, setCompraEditada] = useState<Compra | null>(null);

  const editarCompra = async (id: number, dto: CompraRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const updated = await CompraService.editar(id, dto);
      setCompraEditada(updated);
      return updated;
    } catch (err) {
      console.error("Erro ao editar compra:", err);
      setError("Não foi possível editar a compra.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { editarCompra, compraEditada, loading, error };
}

export function useRemoverCompra() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [removida, setRemovida] = useState<boolean>(false);

  const removerCompra = async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      await CompraService.remover(id);
      setRemovida(true);
    } catch (err) {
      console.error("Erro ao remover compra:", err);
      setError("Não foi possível remover a compra.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { removerCompra, removida, loading, error };
}
