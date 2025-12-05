import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/Navbar";
import FaviconManager from "./components/FavIcon";
import PrivateRoute from "./components/PrivateRoute";
import { AuthProvider } from "./context/AuthContext";
import { CategoriaProvider } from "./context/CategoriaContext";

import "./styles/global.css";

const SplashScreen = lazy(() => import("./pages/SplashScreen"));
const Home = lazy(() => import("./pages/Home"));
const Eventos = lazy(() => import("./pages/Eventos"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Inscricoes = lazy(() => import("./pages/Inscricoes"));

function LoadingFallback() {
  return <div style={{ padding: 24 }}>Carregando...</div>;
}

function NotFound() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Página não encontrada</h2>
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
      <FaviconManager defaultIcon="/favicon.ico" />
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CategoriaProvider>
        <BrowserRouter>
          <Layout>
            <Suspense fallback={<LoadingFallback />}>
              <Routes>
                <Route path="/" element={<SplashScreen />} />

                <Route
                  path="/home"
                  element={
                    <PrivateRoute>
                      <Home />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/eventos"
                  element={
                    <PrivateRoute>
                      <Eventos />
                    </PrivateRoute>
                  }
                />

                <Route
                  path="/inscricoes"
                  element={
                    <PrivateRoute>
                      <Inscricoes />
                    </PrivateRoute>
                  }
                />

                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </CategoriaProvider>
    </AuthProvider>
  );
}
