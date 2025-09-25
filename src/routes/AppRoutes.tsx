import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home/Home";
import Dashboard from "../pages/dashboard/Dashboard";
import Navbar from "../components/layout/navbar/NavBar";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import SideMenu from "../components/layout/side-menu/SideMenu";
import "../styles/AppLayout.css";
import { ToastContainer } from "react-toastify";
import OvinoFullInfo from "../components/dashboard/gerenciar/ovinoFullInfo/OvinoFullInfo";

const AppRoutes: React.FC = () => {
  const { isLoggedIn } = useAuth();
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
        <Route path="/dashboard/ovinos/fullinfo" element={<OvinoFullInfo />} />
        </Routes>
        <ToastContainer position="top-center" autoClose={3000} />
      </div>
    </>
  );
};

export default AppRoutes;
