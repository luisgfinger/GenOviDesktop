import React from "react";
import "./NavBar.css";
import LogoType from "../logo/Logo";
import { useNavigate } from "react-router-dom";

interface NavItem {
  label: string;
  href: string;
}

interface NavbarProps {
  items: NavItem[];
}

const Navbar: React.FC<NavbarProps> = ({ items }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");

    navigate("/");
  };

  return (
    <nav className="flex">
      <span>
        <a href="/"><LogoType /></a>
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
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};

export default Navbar;
