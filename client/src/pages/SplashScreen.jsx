import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/splashScreen.css";

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
            src="/logoapp.png" 
            alt="logo" 
            className="logo-img" 
          />
          <h1 className="logo-title">Party Ferret</h1>
        </div>
      </div>

      {/* LADO DIREITO */}
      <div className="right-section">
        <h2 className="brand-title">Sobre a nossa marca</h2>

        <p className="brand-text">
          Criamos soluções inteligentes para ajudar pequenos e médios negócios
          a crescerem de forma organizada, profissional e moderna.
          Nossa missão é levar tecnologia e simplicidade para o seu dia a dia.
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
