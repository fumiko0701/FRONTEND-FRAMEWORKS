import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBirthdayCake, FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { logoutUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { usuario, setUsuario } = useAuth();
  const firstName = usuario?.nome?.split(" ")[0] ?? "";

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {}
    localStorage.removeItem("token");
    setUsuario(null);
    navigate("/");
    setMenuOpen(false); // garante que o menu feche ao logout
  };

  return (
    <>
      {/* NAVBAR FIXA */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: 70,
          padding: "0 22px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "linear-gradient(90deg,#5a382e,#4e342e)",
          boxShadow: "0 6px 18px rgba(0,0,0,0.35)",
          zIndex: 2000,
        }}
      >
        {/* LOGO / FURRÃO */}
        <div
          style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
          onClick={() => navigate("/home")}
        >
          <img
            src="/ferret_scarf.png"
            alt="Ferret Logo"
            style={{
              height: 60,   // <-- AQUI: aumenta/diminui para mudar tamanho da arte
              width: "auto",
              objectFit: "contain",
              marginRight: 12,
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          />
        </div>

        {/* LINKS PRINCIPAIS */}
        <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
          <Link
            to="/eventos"
            style={{
              color: "#ffe8a6",
              textDecoration: "none",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <FaBirthdayCake size={18} /> Eventos
          </Link>

          <Link
            to="/convites"
            style={{
              color: "#ffe8a6",
              textDecoration: "none",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Convites
          </Link>

          <Link
            to="/pagamentos"
            style={{
              color: "#ffe8a6",
              textDecoration: "none",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Pagamentos
          </Link>

          <Link
            to="/inscricoes"
            style={{
              color: "#ffe8a6",
              textDecoration: "none",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            Inscrições
          </Link>
        </div>

        {/* PERFIL / MENU */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {firstName && (
            <span style={{ color: "#ffe8a6", fontWeight: 700 }}>
              {firstName}
            </span>
          )}

          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "#d4b37a",
              color: "#3e2723",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: 700,
              fontSize: 15,
              textTransform: "uppercase",
            }}
          >
            {firstName ? firstName[0] : "?"}
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            style={{
              background: "transparent",
              border: "none",
              color: "#ffe8a6",
              cursor: "pointer",
              padding: 8,
            }}
          >
            <FaBars size={20} />
          </button>
        </div>
      </nav>

      {/* ESPAÇO PARA NAVBAR */}
      <div style={{ height: 70 }} />

      {/* BACKDROP DO MENU LATERAL */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.3)",
            zIndex: 1998,
            transition: "all 0.3s",
            pointerEvents: "auto", // garante que clicks rápidos funcionem
          }}
        />
      )}

      {/* MENU LATERAL */}
      <aside
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100vh",
          width: 260,
          background: "linear-gradient(180deg,#5a382e,#3e2723)",
          padding: 20,
          boxShadow: "-6px 0 20px rgba(0,0,0,0.4)",
          transform: menuOpen ? "translateX(0)" : "translateX(110%)",
          transition: "transform 0.35s ease-in-out",
          zIndex: 2000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center", // centraliza horizontalmente
        }}
      >
        <button
          onClick={() => setMenuOpen(false)}
          style={{
            background: "transparent",
            border: "none",
            color: "#ffe8a6",
            cursor: "pointer",
            marginBottom: 16,
            alignSelf: "flex-end", // mantém no canto superior direito
          }}
        >
          <FaTimes size={18} />
        </button>

        <h3 style={{ color: "#ffe8a6", marginBottom: 14 }}>Menu</h3>

        <Link
          to="/perfil"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            color: "#ffe8a6",
            textDecoration: "none",
            padding: "10px 12px",
            borderRadius: 6,
            marginBottom: 10,
            fontWeight: 700,
            background: "rgba(255,220,160,0.12)",
            justifyContent: "center", // centraliza
            width: "100%",
          }}
        >
          <FaUserCircle /> Gerenciar perfil
        </Link>

        <button
          onClick={handleLogout}
          style={{
            marginTop: 10,
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "none",
            background: "rgba(255,220,160,0.12)",
            color: "#ffe8a6",
            cursor: "pointer",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // centraliza horizontalmente
            gap: 8,
          }}
        >
          <FaSignOutAlt /> Fazer Logout
        </button>
      </aside>
    </>
  );
}
