import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import LoginForm from "../../components/login/LoginForm";
import Footer from "../../components/footer/Footer";

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard/ovinos");
  };

  return (
    <div className="container flex-column">
      <LoginForm onLoginSuccess={handleLogin} />
      <Footer />
    </div>
  );
};

export default Home;
