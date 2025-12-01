// App.js
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import FaviconManager from "./components/FavIcon";

import "./styles/global.css";

const SplashScreen = lazy(() => import("./pages/SplashScreen"));
const Home = lazy(() => import("./pages/Home"));
const Eventos = lazy(() => import("./pages/Eventos"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));

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

function Layout({ children }) {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/register" ||
    location.pathname === "/login";

  return (
    <>
      {/* ---- SISTEMA UNIVERSAL DE FAVICON ---- */}
      <FaviconManager
        defaultIcon="/favicon.ico"

        // --- FUTURO: ÍCONES POR ROTA
        // Basta descomentar e colocar seus ícones:
        //
        // routeIcons={{
        //   "/login": "/icon-login.ico",
        //   "/register": "/icon-register.ico",
        //   "/eventos": "/icon-eventos.ico",
        // }}
      />

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
            <Route path="/" element={<SplashScreen />} />
            <Route path="/home" element={<Home />} />
            <Route path="/eventos" element={<Eventos />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Layout>
    </BrowserRouter>
  );
}
