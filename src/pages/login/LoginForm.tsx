import React, { useState } from "react";
import "./LoginForm.css";
import "../../styles/Button.css";
import Plant from "../../components/plant/Plant";

interface LoginFormProps {
  onLogin: (user: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !password) {
      setError("Preencha todos os campos.");
      return;
    }

    setError("");
    onLogin(user, password);
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
            value={user}
            onChange={(e) => setUser(e.target.value)}
          />
          <label id="password">Senha</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="primary-button" type="submit">
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
