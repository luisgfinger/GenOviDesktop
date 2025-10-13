import { useEffect, useState } from "react";
import { VendedorService } from "../../services/vendedor/VendedorService";
import type { VendedorRequestDTO } from "../../dtos/vendedor/VendedorRequestDTO";
import type { VendedorResponseDTO } from "../../dtos/vendedor/VendedorResponseDTO";

export function useVendedores() {
  const [vendedores, setVendedores] = useState<VendedorResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendedores = async () => {
      try {
        const data = await VendedorService.listarTodos();
        setVendedores(data);
      } catch (err) {
        console.error("Erro ao buscar vendedores:", err);
        setError("Não foi possível carregar os vendedores.");
      } finally {
        setLoading(false);
      }
    };

    fetchVendedores();
  }, []);

  return { vendedores, loading, error };
}

export function useCriarVendedor() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [novoVendedor, setNovoVendedor] = useState<VendedorResponseDTO | null>(null);

  const criarVendedor = async (dto: VendedorRequestDTO) => {
    setLoading(true);
    setError(null);

    try {
      const created = await VendedorService.salvar(dto);
      setNovoVendedor(created);
      return created;
    } catch (err) {
      console.error("Erro ao cadastrar vendedor:", err);
      setError("Não foi possível cadastrar o vendedor.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { criarVendedor, novoVendedor, loading, error };
}
