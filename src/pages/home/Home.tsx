import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/navbar/NavBar";
import "./Home.css";
import LoginForm from '../login/LoginForm';
import Footer from "../../components/footer/Footer";

const navItems = [
  { label: "Sobre nós", href: "#home" },
  { label: "Suporte", href: "#about" },
  { label: "Preços", href: "#contact" },
  { label: "Serviços", href: "#blog" },
];

const Home: React.FC = () => {
  const navigate = useNavigate(); 

  const handleLogin = (username: string) => {
    console.log("Usuário logado:", localStorage.getItem("username"));
    navigate("/dashboard");
  };

  return (
    <>
      <div className="container flex-column">
        <LoginForm onLoginSuccess={handleLogin}/>
        <Footer/>
      </div>
    </>
  );
};

export default Home;
