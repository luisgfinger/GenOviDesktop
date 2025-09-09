import React from "react";
import "./NavBar.css";
import LogoType from "../../common/logo/Logo";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../common/buttons/Button";

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();

  const items = isLoggedIn
    ? [
        { label: "Dashboard", href: "/dashboard/ovinos" },
        { label: "Perfil", href: "/profile" },
      ]
      
    : [
        { label: "Sobre nós", href: "#home" },
        { label: "Suporte", href: "#about" },
        { label: "Preços", href: "#contact" },
        { label: "Serviços", href: "#blog" },
      ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="flex">
      <span>
        <a href="/">
          <LogoType />
        </a>
      </span>
      <ul className="flex">
        {items.map((item, index) => (
          <li key={index}>
            <h3 className="link-effect">
              <a href={item.href}>{item.label}</a>
            </h3>
          </li>
        ))}
      </ul>
      {isLoggedIn && <a><Button onClick={handleLogout}>Logout</Button></a>}
    </nav>
  );
};

export default Navbar;
