import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home/Home";
import Dashboard from "../pages/dashboard/Dashboard";
import Navbar from "../components/navbar/NavBar";

const AppRoutes: React.FC = () => {
  const isLoggedIn = !!localStorage.getItem("username");

  const getNavItems = (isLoggedIn: boolean) => {
    if (isLoggedIn) {
      return [
        { label: "Dashboard", href: "/dashboard/ovinos" },
        { label: "Perfil", href: "/profile" },
        { label: "Sair", href: "/logout" },
      ];
    } else {
      return [
        { label: "Sobre nós", href: "#home" },
        { label: "Suporte", href: "#about" },
        { label: "Preços", href: "#contact" },
        { label: "Serviços", href: "#blog" },
      ];
    }
  };

  return (
    <>
      <Navbar items={getNavItems(isLoggedIn)} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard/*"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
