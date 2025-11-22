import React from "react";
import "./UsuarioCard.css";
import Button from "../../buttons/Button";
import { Role } from "../../../../api/enums/role/Role";

interface UsuarioCardProps {
  email: string;
  ativo: boolean;
  roles: Role[];
  funcionarioNome?: string;
  autenticacao2fa?: boolean | null;
  onClick?: () => void;
}

const UsuarioCard: React.FC<UsuarioCardProps> = ({
  email,
  ativo,
  roles,
  funcionarioNome,
  autenticacao2fa,
  onClick,
}) => {
  const emailPrefix = email.split("@")[0];

  return (
    <ul
      className="usuarioCard-container flex-column"
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <li className="flex">
        <div className="flex-column">
          <h3>{emailPrefix}</h3>
        </div>
      </li>

      <li className="middle-column flex-column">
        <span className="flex">
          <h3>Status:</h3>
          <p>{ativo ? "Ativo" : "Inativo"}</p>
        </span>

        <span className="flex">
          <h3>Função:</h3>
          <p>{roles?.join(", ").replace(/ROLE_/g, "") || "Sem função"}</p>
        </span>

        <span className="flex">
          <h3>2FA:</h3>
          <p>{autenticacao2fa ? "Ativado" : "Desativado"}</p>
        </span>

        {funcionarioNome && (
          <span className="flex">
            <h3>Funcionário:</h3>
            <p>{funcionarioNome}</p>
          </span>
        )}
      </li>

      <li className="usuarioCard-buttons flex-column">
        <Button
          variant="cardPrimary"
          onClick={onClick}
        >
          Ver mais
        </Button>
      </li>
    </ul>
  );
};

export default UsuarioCard;
