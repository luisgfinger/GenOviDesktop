import { useEffect, useState, useCallback } from "react";
import { UsuarioService } from "../../services/usuario/UsuarioService";
import type { Usuario } from "../../models/usuario/UsuarioModel";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsuarios = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await UsuarioService.listar();
      setUsuarios(data);
    } catch (err: any) {
      console.error("Erro ao buscar usuários:", err);
      setError(err.response?.data?.message || "Erro ao carregar usuários");
    } finally {
      setLoading(false);
    }
  }, []);

  const criarUsuario = useCallback(async (usuario: Usuario) => {
    setLoading(true);
    setError(null);
    try {
      const novo = await UsuarioService.criar(usuario);
      setUsuarios((prev) => [...prev, novo]);
      return novo;
    } catch (err: any) {
      console.error("Erro ao criar usuário:", err);
      setError(err.response?.data?.message || "Erro ao criar usuário");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);


  const atualizarUsuario = useCallback(async (id: number, usuario: Usuario) => {
    setLoading(true);
    setError(null);
    try {
      const atualizado = await UsuarioService.atualizar(id, usuario);
      setUsuarios((prev) =>
        prev.map((u) => (u.id === id ? atualizado : u))
      );
      return atualizado;
    } catch (err: any) {
      console.error("Erro ao atualizar usuário:", err);
      setError(err.response?.data?.message || "Erro ao atualizar usuário");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deletarUsuario = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await UsuarioService.deletar(id);
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      console.error("Erro ao deletar usuário:", err);
      setError(err.response?.data?.message || "Erro ao deletar usuário");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);

  return {
    usuarios,
    loading,
    error,
    refetch: fetchUsuarios,
    criarUsuario,
    atualizarUsuario,
    deletarUsuario,
  };
}
