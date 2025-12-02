import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "../styles/register.css";

export default function Login() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Entrar";
  }, []);

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const response = await loginUser(email, senha);
      const data = response.data;

      // Salva token enviado pelo backend
      localStorage.setItem("token", data.token);

      // Redireciona
      navigate("/home");
    } 
    catch (error) {
      console.error("Erro no login:", error);

      if (error.response) {
        // === Mensagens EXATAS do backend ===
        const backendError = error.response.data.erro || error.response.data.message;

        if (backendError === "Usuário ou senha incorretos.") {
          setErro("E-mail ou senha incorretos.");
        } else if (backendError) {
          setErro(backendError);
        } else {
          setErro("Erro ao fazer login.");
        }
      } else {
        setErro("Erro inesperado. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="left-section">
        <div className="logo-wrapper">
          <img src="/logoapp.png" alt="logo" className="logo-img" />
          <h1 className="logo-title">Party Ferret</h1>
        </div>
      </div>

      <div className="register-right">
        <form className="register-form" onSubmit={handleLogin}>
          <h2>Entrar</h2>

          {erro && <p className="register-error">{erro}</p>}

          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Entrando..." : "Login"}
          </button>

          <p className="register-login">
            Não tem conta?{" "}
            <span onClick={() => navigate("/register")}>Registrar</span>
          </p>
        </form>
      </div>
    </div>
  );
}
