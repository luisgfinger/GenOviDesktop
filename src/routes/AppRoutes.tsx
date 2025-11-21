import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "../pages/home/Home";
import Dashboard from "../pages/dashboard/Dashboard";
import Navbar from "../components/layout/navbar/NavBar";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import SideMenu from "../components/layout/side-menu/SideMenu";
import "../styles/AppLayout.css";
import { ToastContainer } from "react-toastify";
import IAButton from "../components/common/ia/IAButton";
import { getIaConfig } from "../routes/ia/GetIAConfig";
import type { Ovino } from "../api/models/ovino/OvinoModel";

const AppRoutes: React.FC = () => {
  const { isLoggedIn } = useAuth();
  const location = useLocation();
  const pathname = location.pathname;

  const state = location.state as any;

  const ovino = state?.ovino as Ovino | undefined;
  const contextoDaRota = state?.contextoIA;

  const contextoIA = contextoDaRota ?? ovino ?? null;

  const iaConfig = getIaConfig(pathname, contextoIA);

  const rotasComIAProprio = ["/dashboard/ovinos/reproducoes/criar"];

  const esconderIAButtonGlobal = rotasComIAProprio.some((rota) =>
    pathname.startsWith(rota)
  );

  return (
    <>
      <Navbar />
      <div className={isLoggedIn ? "app-layout flex" : "flex"}>
        {isLoggedIn && <SideMenu />}

        <Routes>
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard/ovinos" replace />
              ) : (
                <Home />
              )
            }
          />
        </Routes>

        {!esconderIAButtonGlobal && isLoggedIn &&(
          <IAButton
            promptPreDefinido={iaConfig.promptPreDefinido}
            permitirInputUsuario={iaConfig.permitirInputUsuario}
            promptOptions={iaConfig.promptOptions}
            contextoIA={contextoIA}
          />
        )}

        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </>
  );
};

export default AppRoutes;
