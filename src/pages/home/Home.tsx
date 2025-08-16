import React from "react";
import Navbar from "../../components/navbar/NavBar";
import "./Home.css"
import LoginForm from '../login/LoginForm';
import Footer from "../../components/footer/Footer";
import Plant from "../../components/plant/Plant"

const navItems = [
  { label: "Sobre nós", href: "#home" },
  { label: "Suporte", href: "#about" },
  { label: "Preços", href: "#contact" },
  { label: "Serviços", href: "#blog" },
];

const Home: React.FC = () => {
   const handleLogin = (email: string, password: string) => {
    console.log("E-mail:", email);
    console.log("Senha:", password);
  };


  return (
    <>
      <Navbar items={navItems} />
      <div className="container flex-column">
        <LoginForm onLogin={handleLogin}/>
        <Footer/>
      </div>
    </>
  );
};

export default Home;
