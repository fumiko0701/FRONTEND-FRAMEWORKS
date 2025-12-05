import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/splashScreen.css";

const backendURL = process.env.REACT_APP_API_URL?.replace(/\/$/, "") || "";

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Bem-vindo!";
  }, []);

  const irParaLogin = () => {
    navigate("/login");
  };

  const irParaRegistro = () => {
    navigate("/register");
  };

  return (
    <div className="splash-container">

      {/* LADO ESQUERDO */}
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

      {/* LADO DIREITO */}
      <div className="right-section">
        <h2 className="brand-title">Sobre o Ferret’s Party</h2>

        <p className="brand-text">
          Um sistema simples e rápido para organizar eventos, palestras e inscrições.
          Criado para facilitar o trabalho de quem gerencia e de quem participa.
        </p>

        <div className="splash-buttons">
          <button className="btn-login" onClick={irParaLogin}>
            Entrar
          </button>

          <button className="btn-register" onClick={irParaRegistro}>
            Criar Conta
          </button>
        </div>
      </div>
    </div>
  );
}
