import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import LoginForm from "../../components/form/loginForm/LoginForm";
import Footer from "../../components/layout/footer/Footer";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard/ovinos");
  };

  return (
    <div className="home-container flex-column">
      <LoginForm onLoginSuccess={handleLogin} />
      <Footer />
    </div>
  );
};

export default Home;
