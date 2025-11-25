import React, { createContext, useContext, useState, useEffect } from "react";
import { getUsuarioIdByEmail } from "../utils/getUsuarioIdByEmail";
import { UsuarioService } from "../api/services/usuario/UsuarioService";
import { isAdmin as isAdminFn } from "../utils/isAdmin";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string, token: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  funcionarioNome: string | null;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  const [funcionarioNome, setFuncionarioNome] = useState<string | null>(null);
  const [isAdminState, setIsAdminState] = useState<boolean>(false);

  useEffect(() => {
    const email = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const loginTime = localStorage.getItem("loginTime");

    const savedNome = localStorage.getItem("funcionarioNome");
    const savedAdmin = localStorage.getItem("isAdmin");

    if (savedNome) setFuncionarioNome(savedNome);
    if (savedAdmin) setIsAdminState(savedAdmin === "true");

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

      const usuario = await UsuarioService.buscarPorId(usuarioId);


      const admin = isAdminFn(usuario);
      setIsAdminState(admin);
      localStorage.setItem("isAdmin", String(admin));
      const nomeFuncionario = usuario.funcionario?.nome ?? "Admin";
      const funcionarioId = usuario.funcionario?.id ?? null;

      setFuncionarioNome(nomeFuncionario);
      localStorage.setItem("funcionarioNome", nomeFuncionario);

      if (funcionarioId !== null) {
        localStorage.setItem("funcionarioId", String(funcionarioId));
      }else{
        console.log("Funcionario id é null");
      }

    } catch (error) {
      console.error("Erro ao salvar informações do funcionário:", error);
    }
  };


  const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");

    localStorage.removeItem("usuarioId");
    localStorage.removeItem("funcionarioNome");
    localStorage.removeItem("funcionarioId");
    localStorage.removeItem("isAdmin");

    setFuncionarioNome(null);
    setIsAdminState(false);
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        login,
        logout,
        loading,
        funcionarioNome,
        isAdmin: isAdminState,
      }}
    >
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
