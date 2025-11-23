import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import "./styles/global.css";

// Lazy loading das páginas
const SplashScreen = lazy(() => import("./pages/SplashScreen"));
const Home = lazy(() => import("./pages/Home"));
const Eventos = lazy(() => import("./pages/Eventos"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register")); // caso tenha

function LoadingFallback() {
  return (
    <div style={{ padding: 24 }}>
      <p>Carregando...</p>
    </div>
  );
}

function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Página não encontrada</h2>
      <p>Verifique a URL ou volte para a página inicial.</p>
    </div>
  );
}

// Controla se a Navbar será exibida ou não
function Layout({ children }) {
  const location = useLocation();

  // Oculta a Navbar na SplashScreen
  const hideNavbar = location.pathname === "/" || location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>

            {/* SPLASHSCREEN → PRIMEIRA TELA */}
            <Route path="/" element={<SplashScreen />} />

            {/* Suas rotas normais */}
            <Route path="/home" element={<Home />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
