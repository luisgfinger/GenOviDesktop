import React, { useState } from "react";
import "./LoginForm.css";
import Plant from "../../common/plant/Plant";
import { login as loginService } from "../../../api/services/LoginService";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../common/buttons/Button";

interface LoginFormProps {
  onLoginSuccess: (username: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !senha) {
      setError("Preencha todos os campos.");
      return;
    }

    setError("");

    try {
      const data = await loginService(email, senha);
      login(email, data.token);
      onLoginSuccess(email);
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
          <label>Email</label>
          <input
            type="email"
            placeholder="Digite seu usuário"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label id="senha">Senha</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <Button variant="login" type="submit">
            Entrar
          </Button>

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
