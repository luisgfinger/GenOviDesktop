import React, { createContext, useContext, useState, useEffect } from "react";
import { getUsuarioIdByEmail } from "../utils/getUsuarioIdByEmail";
import { getFuncionarioIdByUsuarioId } from "../utils/getFuncionarioIdByUsuarioId";
import { UsuarioService } from "../api/services/usuario/UsuarioService";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string, token: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const loginTime = localStorage.getItem("loginTime");

    if (email && token && loginTime) {
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (now - Number(loginTime) < twentyFourHours) {
        setIsLoggedIn(true);
      } else {
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, token: string) => {
    localStorage.setItem("email", email);
    localStorage.setItem("token", token);
    localStorage.setItem("loginTime", Date.now().toString());
    setIsLoggedIn(true);

    try {
      const usuarioId = await getUsuarioIdByEmail();
      if (!usuarioId) return;

      if (usuarioId === 1) {
        localStorage.setItem("funcionarioNome", "Admin");
        localStorage.setItem("usuarioId", "1");
        console.log("Usuário admin detectado — nome definido como 'Admin'.");
        return;
      }

      const funcionarioId = await getFuncionarioIdByUsuarioId(usuarioId);
      if (!funcionarioId) return;

      const usuario = await UsuarioService.buscarPorId(usuarioId);
      const nomeFuncionario = usuario.funcionario?.nome ?? null;

      if (nomeFuncionario) {
        console.log("Salvando nome do funcionário no localStorage:", nomeFuncionario);
        localStorage.setItem("funcionarioNome", nomeFuncionario);
      }
    } catch (error) {
      console.error("Erro ao salvar nome do funcionário:", error);
    }
  };

  const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("funcionarioNome");
    localStorage.removeItem("funcionarioId");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
