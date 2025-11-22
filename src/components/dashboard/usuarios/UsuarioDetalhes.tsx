import React from "react";
import DetalhesBase, { type CampoConfig } from "../../common/detalhesBase/DetalhesBase";
import { UsuarioService } from "../../../api/services/usuario/UsuarioService";
import type { UsuarioResponseDTO } from "../../../api/dtos/usuario/UsuarioResponseDTO";

interface UsuarioDetalhesProps {
  usuario: UsuarioResponseDTO;
  onClose: () => void;
}

const UsuarioDetalhes: React.FC<UsuarioDetalhesProps> = ({ usuario, onClose }) => {

  const campos: CampoConfig<UsuarioResponseDTO>[] = [
    {
      label: "E-mail",
      key: "email",
      renderView: (valor) => valor ?? "—",
      renderEdit: (valor, onChange) => (
        <input
          type="email"
          value={valor ?? ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )
    },
    {
      label: "Ativo",
      key: "ativo",
      renderView: (valor) => (valor ? "Ativo" : "Inativo"),
      renderEdit: (valor, onChange) => (
        <select
          value={valor ? "true" : "false"}
          onChange={(e) => onChange(e.target.value === "true")}
        >
          <option value="true">Ativo</option>
          <option value="false">Inativo</option>
        </select>
      )
    },
    {
      label: "Autenticação 2FA",
      key: "autenticacao2fa",
      renderView: (valor) => (valor ? "Habilitada" : "Desabilitada"),
      renderEdit: (valor, onChange) => (
        <select
          value={valor ? "true" : "false"}
          onChange={(e) => onChange(e.target.value === "true")}
        >
          <option value="true">Habilitada</option>
          <option value="false">Desabilitada</option>
        </select>
      )
    },
    {
      label: "Funções (Roles)",
      key: "enumRoles",
      renderView: (valor) => valor?.join(", ") ?? "—",
      renderEdit: (valor, onChange) => (
        <select
          multiple
          value={valor ?? []}
          onChange={(e) => {
            const roles = Array.from(e.target.selectedOptions).map((o) => o.value);
            onChange(roles);
          }}
        >
          <option value="ROLE_USER">ROLE_USER</option>
          <option value="ROLE_ADMIN">ROLE_ADMIN</option>
        </select>
      )
    },
    {
      label: "Funcionário Vinculado",
      key: "funcionario",
      renderView: (valor) => valor?.nome ?? "—",
      renderEdit: () => (
        <p style={{ opacity: 0.6 }}>
          Não editável aqui — o vínculo é configurado no cadastro do Funcionário.
        </p>
      )
    }
  ];

  const handleSave = async (data: UsuarioResponseDTO) => {
    await UsuarioService.atualizar(data.id, {
      email: data.email,
      ativo: data.ativo,
      autenticacao2fa: data.autenticacao2fa,
      enumRoles: data.enumRoles
    });
  };

  const handleRemove = async () => {
    await UsuarioService.deletar(usuario.id);
  };

  return (
    <DetalhesBase
      titulo="Detalhes do Usuário"
      item={usuario}
      campos={campos}
      onSave={handleSave}
      onRemove={handleRemove}
      onClose={onClose}
    />
  );
};

export default UsuarioDetalhes;
