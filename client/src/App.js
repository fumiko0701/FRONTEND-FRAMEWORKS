import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import "./styles/global.css"; // estilos globais

// Lazy-load das páginas para garantir que Eventos (e seu fetch) só sejam carregados
// quando o usuário for para /eventos. Isso evita qualquer carga/desencadeamento
// de requests para eventos na inicialização do app.
const Home = lazy(() => import("./pages/Home"));
const Eventos = lazy(() => import("./pages/Eventos"));
const Login = lazy(() => import("./pages/Login"));

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

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />

      {/* Suspense garante fallback enquanto as páginas lazy são carregadas.
          Como Eventos é lazy, o fetch que você colocou em Eventos.jsx só roda
          quando a rota /eventos é acessada. */}
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/eventos" element={<Eventos />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}