import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

export default function Register() {
  const navigate = useNavigate();

  // estados do formulário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro("");

    if (senha !== confirmSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          senha,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErro(data.message || "Erro ao registrar.");
        setLoading(false);
        return;
      }

      // salvar token jwt
      localStorage.setItem("token", data.token);

      // redirecionar
      navigate("/home");

    } catch (error) {
      console.error("Erro no registro:", error);
      setErro("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* lado esquerdo igual splash */}
            <div className="left-section">
        <div className="logo-wrapper">
          <img 
            src="/logoapp.png" 
            alt="logo" 
            className="logo-img" 
          />
          <h1 className="logo-title">Party Ferret</h1>
        </div>
      </div>
      {/* lado direito - formulário */}
      <div className="register-right">
        <form className="register-form" onSubmit={handleRegister}>
          <h2>Registrar</h2>

          {erro && <p className="register-error">{erro}</p>}

          <input
            type="text"
            placeholder="Nome completo"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />

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

          <input
            type="password"
            placeholder="Confirmar senha"
            value={confirmSenha}
            onChange={(e) => setConfirmSenha(e.target.value)}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Registrando..." : "Criar Conta"}
          </button>

          <p className="register-login">
            Já tem conta?{" "}
            <span onClick={() => navigate("/login")}>Entrar</span>
          </p>
        </form>
      </div>
    </div>
  );
}
