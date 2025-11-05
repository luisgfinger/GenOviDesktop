import React, { useState } from "react";
import "./UsuarioListSheet.css";
import { motion, AnimatePresence } from "framer-motion";
import UsuarioCard from "../../../common/cards/usuarioCard/UsuarioCard";
import type { Usuario } from "../../../../api/models/usuario/UsuarioModel";

interface UsuarioListSheetProps {
  usuarios: Usuario[];
}

const UsuarioListSheet: React.FC<UsuarioListSheetProps> = ({ usuarios }) => {
  const [selectedUsuario, setSelectedUsuario] = useState<Usuario | null>(null);

  const handleUsuarioSelect = (usuario: Usuario) => {
    setSelectedUsuario(usuario);
    console.log("Selecionado:", usuario);
  };

  return (
    <div className="usuarioSheet-container flex">
      {/* Card animado à direita */}
      <AnimatePresence mode="wait">
        {selectedUsuario && (
          <motion.div
            key={selectedUsuario.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ transformOrigin: "center" }}
          >
            <UsuarioCard
              email={selectedUsuario.email}
              ativo={selectedUsuario.ativo}
              roles={selectedUsuario.enumRoles}
              funcionarioNome={selectedUsuario.funcionario?.nome}
              autenticacao2fa={selectedUsuario.autenticacao2fa}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de usuários */}
      <ul className="usuarioSheet-container-inside flex-column">
        <li className="usuarioSheet-titles-row flex">
          <span className="flex">ID</span>
          <span className="flex">E-MAIL</span>
          <span className="flex">STATUS</span>
          <span className="flex">FUNÇÃO</span>
          <span className="flex">FUNCIONÁRIO</span>
        </li>

        {usuarios.map((usuario, index) => (
          <li
            key={usuario.id}
            className={`usuarioSheet-row flex ${
              index % 2 === 0 ? "par" : "impar"
            } ${selectedUsuario?.id === usuario.id ? "selecionado" : ""}`}
            onClick={() => handleUsuarioSelect(usuario)}
          >
            <span className="flex">{usuario.id}</span>
            <span className="flex">{usuario.email}</span>
            <span className="flex">{usuario.ativo ? "Ativo" : "Inativo"}</span>
            <span className="flex">
              {usuario.enumRoles.join(", ").replace(/ROLE_/g, "")}
            </span>
            <span className="flex">
              {usuario.funcionario?.nome || "-"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsuarioListSheet;
