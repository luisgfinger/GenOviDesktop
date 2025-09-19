import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/home/Home";
import Dashboard from "../pages/dashboard/Dashboard";
import Navbar from "../components/layout/navbar/NavBar";
import ProtectedRoute from "./ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import SideMenu from "../components/layout/side-menu/SideMenu";
import "../styles/AppLayout.css";

const AppRoutes: React.FC = () => {
  //const { isLoggedIn } = useAuth();
  const isLoggedIn = true;
  return (
    <>
      <Navbar />
      <div className={isLoggedIn ? "app-layout flex" : "flex"}>
        {isLoggedIn && <SideMenu />}
        <Routes>
          <Route path="/dashboard/*" element={<Dashboard />} />
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
      </div>
    </>
  );
};

export default AppRoutes;
