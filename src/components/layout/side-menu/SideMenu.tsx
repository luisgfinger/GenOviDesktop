import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Ovinos from "../../../assets/icons/ovinos.png";
import Funcionarios from "../../../assets/icons/funcionarios.png";
import Notificacoes from "../../../assets/icons/notificacoes.png";
import Ia from "../../../assets/icons/ia.png";
import Arrow from "../../../assets/icons/backArrow.png";
import "./SideMenu.css";

const SideMenu: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "OVINOS", icon: Ovinos, path: "/dashboard/ovinos" },
    { label: "CRIADORES", icon: Funcionarios, path: "/dashboard/criadores" },
    { label: "NOTIFICAÇÕES", icon: Notificacoes, path: "/notificacoes" },
    { label: "IA", icon: Ia, path: "/ia" },
  ];

  console.log(location.pathname);

  const handleBack = () => {
    const currentPath = location.pathname;
    navigate(-1);

    setTimeout(() => {
      if (location.pathname === currentPath) {
        navigate("/dashboard/ovinos", { replace: true });
      }
    }, 50);
  };

  return (
    <div className="sideMenu-container flex">
      <ul className="flex-column">
        {menuItems.map((item, index) => {
          console.log("Item path:", item.path);
          console.log("Current path:", location.pathname);

          return (
            <React.Fragment key={item.label}>
              <li
                className={`flex ${location.pathname.startsWith(item.path) ? "active" : ""}`}
                onClick={() => {
                  if (!location.pathname.startsWith(item.path)) {
                    navigate(item.path);
                  }
                }}
              >
                <img src={item.icon} alt={item.label.toLowerCase()} />
                <p>{item.label}</p>
              </li>
              {index < menuItems.length - 1 && (
                <span className="separator"></span>
              )}
            </React.Fragment>
          );
        })}
        <span className="separator" onClick={handleBack}></span>
        <span className="backArrow flex">
          <img src={Arrow} alt="voltar" />
          <p>VOLTAR</p>
        </span>
      </ul>
    </div>
  );
};

export default SideMenu;
