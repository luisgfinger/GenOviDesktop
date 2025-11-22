import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

import Ovinos from "../../../assets/icons/ovinos.png";
import Funcionarios from "../../../assets/icons/funcionarios.png";
import Ia from "../../../assets/icons/ia.png";
import Register from "../../../assets/icons/register.png";
import Arrow from "../../../assets/icons/backArrow.png";
import Users from "../../../assets/icons/users.png";

import "./SideMenu.css";
import { useIsAdmin } from "../../../api/hooks/useIsAdmin";

const SideMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAdmin = useIsAdmin();

  const menuItems = [
    { label: "OVINOS", icon: Ovinos, path: "/dashboard/ovinos" },
    { label: "REGISTROS", icon: Register, path: "/dashboard/registros" },
    { label: "IA", icon: Ia, path: "/dashboard/ia" },
    {
      label: "FUNCIONARIOS",
      icon: Funcionarios,
      path: "/dashboard/funcionarios/gerenciar",
      adminOnly: true,
    },
    {
      label: "USUÁRIOS",
      icon: Users,
      path: "/dashboard/usuarios",
      adminOnly: true,
    },
  ];

  const filteredMenu = menuItems.filter((item) => {
    if (item.adminOnly && !isAdmin) return false;
    return true;
  });

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/dashboard/ovinos", { replace: true });
    }
  };

  return (
    <div className="sideMenu-container flex">
      <ul className="flex-column">
        {filteredMenu.map((item, index) => (
          <React.Fragment key={item.label}>
            <li
              className={`flex ${
                location.pathname.startsWith(item.path) ? "active" : ""
              }`}
              onClick={() => {
                if (!location.pathname.startsWith(item.path)) {
                  navigate(item.path);
                }
              }}
            >
              <img src={item.icon} alt={item.label.toLowerCase()} />
              <p>{item.label}</p>
            </li>

            {index < filteredMenu.length - 1 && (
              <span className="separator"></span>
            )}
          </React.Fragment>
        ))}

        <span className="separator" onClick={handleBack}></span>

        <span className="backArrow flex" onClick={handleBack}>
          <img src={Arrow} alt="voltar" />
          <p>VOLTAR</p>
        </span>
      </ul>
    </div>
  );
};

export default SideMenu;
