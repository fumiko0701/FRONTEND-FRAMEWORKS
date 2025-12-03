import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/register.css";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const backendURL = process.env.REACT_APP_API_URL?.replace(/\/$/, "") || "";

export default function Login() {
  const navigate = useNavigate();
  const { setUsuario } = useAuth();

  const furretOffsetX = "-110px";
  const furretOffsetY = "-40px";

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState("");

  const [animateFurret, setAnimateFurret] = useState(false);

  const [mostrarSenha, setMostrarSenha] = useState(true);

  useEffect(() => {
    document.title = "Entrar";
    const timer = setTimeout(() => setAnimateFurret(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    setLoading(true);

    try {
      const response = await loginUser(email, senha);

      localStorage.setItem("token", response.data.token);
      setUsuario(response.data.usuario);

      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect");

      if (redirect) navigate(redirect);
      else navigate("/home");
    } catch (error) {
      const backendError =
        error?.response?.data?.erro || error?.response?.data?.message;
      setErro(backendError || "Erro inesperado. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-container">
      {/* LADO ESQUERDO */}
      <div className="left-section">
        <div className="logo-wrapper">
          <img src={backendURL + "/assets/icon_party.png"}alt="logo" className="logo-img" />
          <h1 className="logo-title">Party Ferret</h1>
        </div>
      </div>

      {/* LADO DIREITO */}
      <div className="register-right">
        <div className="login-card">
          <form className="register-form" onSubmit={handleLogin}>
            <h2>Entrar</h2>

            {erro && <p className="register-error">{erro}</p>}

            {/* CAMPO EMAIL */}
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* CAMPO DE SENHA AJUSTADO — MESMO TAMANHO DO EMAIL */}
            <div className="input-wrapper">
              <input
                type={mostrarSenha ? "text" : "password"}
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />

              <span
                className="toggle-senha"
                onClick={() => setMostrarSenha(!mostrarSenha)}
              >
                {mostrarSenha ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Entrando..." : "Login"}
            </button>

            <p className="register-login">
              Não tem conta?{" "}
              <span onClick={() => navigate("/register")}>Registrar</span>
            </p>
          </form>

          {/* FURÃO */}
          <img
            src={mostrarSenha ? "/fes_full_body1.png" : "/fes_full_body2.png"}
            alt="Furão festivo"
            className="furret-img"
            style={{
              bottom: furretOffsetY,
              right: furretOffsetX,
              transform: animateFurret ? "translateX(0)" : "translateX(300px)",
              transition: "transform 1s cubic-bezier(0.68, -0.55, 0.27, 1.55)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
