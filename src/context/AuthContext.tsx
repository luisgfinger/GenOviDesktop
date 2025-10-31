import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (email: string, token: string) => void;
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
        localStorage.removeItem("email");
        localStorage.removeItem("token");
        localStorage.removeItem("loginTime");
        localStorage.removeItem("usuarioId");
        setIsLoggedIn(false);
      }
    }
    setLoading(false);
  }, []);

  const login = (email: string, token: string) => {
    localStorage.setItem("email", email);
    localStorage.setItem("token", token);
    localStorage.setItem("loginTime", Date.now().toString());
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
    localStorage.removeItem("usuarioId");
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
