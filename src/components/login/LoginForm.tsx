import React, { useState } from "react";
import "./LoginForm.css";
import "../../styles/Button.css";
import Plant from "../plant/Plant";
import { login as loginService } from "../../services/loginService";
import { useAuth } from "../../context/AuthContext";

interface LoginFormProps {
  onLoginSuccess: (username: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !senha) {
      setError("Preencha todos os campos.");
      return;
    }

    setError("");

    try {
      const data = await loginService(username, senha);
      login(username, data.token);
      onLoginSuccess(username);
    } catch (err) {
      console.error(err);
      setError("Usuário ou senha incorretos.");
    }
  };

  return (
    <div className="middle flex">
      <div className="form-container flex-column">
        <form className="flex-column" onSubmit={handleSubmit}>
          <h2>Login</h2>
          {error && <span>{error}</span>}
          <label>Usuário</label>
          <input
            type="text"
            placeholder="Digite seu usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label id="senha">Senha</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <button className="login-button" type="submit">
            ENTRAR
          </button>
          <span className="link-effect">
            <a href="">Esqueceu sua senha?</a>
          </span>
        </form>
        <Plant className="plant" />
      </div>
    </div>
  );
};

export default LoginForm;
