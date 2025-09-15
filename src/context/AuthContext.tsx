import React, { createContext, useContext, useState, useEffect } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  login: (username: string, token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const username = localStorage.getItem("username");
    const token = localStorage.getItem("token");
    const loginTime = localStorage.getItem("loginTime");

    if (username && token && loginTime) {
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;

      if (now - Number(loginTime) < twentyFourHours) {
        setIsLoggedIn(true);
      } else {
        localStorage.removeItem("username");
        localStorage.removeItem("token");
        localStorage.removeItem("loginTime");
        setIsLoggedIn(false);
      }
    }
    setLoading(false);
  }, []);

  const login = (username: string, token: string) => {
    localStorage.setItem("username", username);
    localStorage.setItem("token", token);
    localStorage.setItem("loginTime", Date.now().toString());
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    localStorage.removeItem("loginTime");
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
