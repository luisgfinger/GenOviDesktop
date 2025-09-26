import { useEffect, useState } from "react";
import type { Ovino } from "../../models/ovino/OvinoModel";
import type { OvinoRequestDTO } from "../../dtos/ovino/OvinoRequestDTO";
import { OvinoService } from "../../services/ovino/OvinoService";


export function useOvinos() {
  const [ovinos, setOvinos] = useState<Ovino[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOvinos = async () => {
      try {
        const data = await OvinoService.listarTodos();
        setOvinos(data);
      } catch (err) {
        setError("Erro ao carregar ovinos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOvinos();
  }, []);

  return { ovinos, loading, error };
}


export function useOvino(id: number | null) {
  const [ovino, setOvino] = useState<Ovino | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id === null) {
      setLoading(false);
      setError("ID inválido para buscar ovino");
      return;
    }

    const fetchOvino = async () => {
      try {
        const data = await OvinoService.findById(id);
        setOvino(data);
      } catch (err) {
        setError("Erro ao carregar ovino");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOvino();
  }, [id]);

  return { ovino, loading, error };
}

export function useSalvarOvino() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedOvino, setSavedOvino] = useState<Ovino | null>(null);

  const salvar = async (payload: OvinoRequestDTO) => {
    setLoading(true);
    setError(null);
    try {
      const novoOvino = await OvinoService.salvar(payload);
      setSavedOvino(novoOvino);
      return novoOvino;
    } catch (err) {
      console.error("Erro ao salvar ovino:", err);
      setError("Não foi possível salvar o ovino.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { salvar, savedOvino, loading, error };
}
