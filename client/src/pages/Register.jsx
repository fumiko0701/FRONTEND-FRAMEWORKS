import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

const backendURL = process.env.REACT_APP_API_URL?.replace(/\/$/, "") || "";

export default function Register() {
  const navigate = useNavigate();

  useEffect(() => {
      document.title = "Registre-se";
  }, []);
  
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmSenha, setConfirmSenha] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [tipo, setTipo] = useState("participante");

  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErro("");

    if (senha !== confirmSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    console.log("Enviando para API:", {
      nome,
      email,
      senha,
      data_nascimento: dataNascimento,
      tipo,
    });

    try {
      setLoading(true);

      const response = await fetch("http://localhost:3001/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome,
          email,
          senha,
          data_nascimento: dataNascimento,
          tipo,
        }),
      });
      console.log("Response status:", response.status);
      const data = await response.json();

      if (!response.ok) {
        setErro(data.message || "Erro ao registrar.");
        setLoading(false);
        return;
      }

      // salva token jwt
      localStorage.setItem("token", data.token);

      navigate("/login");
    } catch (error) {
      console.error("Erro no registro:", error);
      setErro("Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">

      {/* lateral esquerda igual a splash */}
      <div className="left-section">
        <div className="logo-wrapper">
          <img
            src={backendURL + "/assets/icon_party.png"}
            alt="logo"
            className="logo-img"
          />
          <h1 className="logo-title">Party Ferret</h1>
        </div>
      </div>

      {/* lado direito */}
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
            type="date"
            value={dataNascimento}
            onChange={(e) => setDataNascimento(e.target.value)}
            required
          />

          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
          >
            <option value="participante">Participante</option>
            <option value="organização">Organização</option>
          </select>

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
