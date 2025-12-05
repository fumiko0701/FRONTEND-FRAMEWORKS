import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaBirthdayCake, FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { logoutUser } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { usuario, setUsuario } = useAuth();
  const firstName = usuario?.nome?.split(" ")[0] ?? "";

  // close on escape
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch {}
    localStorage.removeItem("token");
    setUsuario(null);
    navigate("/");
    setMenuOpen(false);
  };

  return (
    <>
      {/* ===== GLOBAL STYLES FOR THIS COMPONENT ===== */}
      <style>{`
        /* Container reset */
        .ferret-navbar { position: fixed; top: 0; left: 0; right: 0; height: 70px; padding: 0 22px;
          display:flex; align-items:center; justify-content:space-between; z-index:2000;
          box-shadow: 0 8px 28px rgba(0,0,0,0.38);
          backdrop-filter: blur(4px);
        }

        /* Fur-like textured background (pure CSS + tiny SVG noise) */
        .ferret-bg {
          background:
            radial-gradient(1200px 400px at 10% 0%, rgba(255,220,160,0.04), transparent 8%),
            radial-gradient(900px 300px at 90% 100%, rgba(40,22,18,0.06), transparent 8%),
            linear-gradient(90deg, #6a463d 0%, #4c3129 58%, #3e2723 100%);
          position: relative;
          overflow: hidden;
        }
        /* subtle fur strokes using repeating-linear-gradient */
        .ferret-bg::before {
          content: "";
          position: absolute; inset:0;
          background:
            repeating-linear-gradient(120deg, rgba(255,255,255,0.02) 0 2px, rgba(0,0,0,0.00) 2px 6px),
            repeating-linear-gradient(70deg, rgba(0,0,0,0.03) 0 3px, rgba(255,255,255,0.00) 3px 9px);
          mix-blend-mode: overlay;
          opacity: 0.28;
          pointer-events: none;
        }
        /* tiny noise via embedded SVG data URI so background looks less flat */
        .ferret-bg::after {
          content: "";
          position: absolute; inset:0;
          background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16'><filter id='a'><feTurbulence baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23a)' opacity='0.03'/></svg>");
          opacity: 0.9;
          mix-blend-mode: soft-light;
          pointer-events: none;
        }

        /* Logo area */
        .ferret-left { display:flex; align-items:center; gap:12px; cursor:pointer; z-index:1; }
        .ferret-logo {
          height:60px; width:auto; display:block; transition: transform .25s cubic-bezier(.2,.9,.25,1);
          border-radius:10px;
        }
        .ferret-logo:hover { transform: translateY(-3px) rotate(-2deg) scale(1.06); }

        /* central links */
        .ferret-links { display:flex; gap:18px; align-items:center; z-index:1; }
        .ferret-link {
          color: #fff1d6;
          text-decoration: none;
          font-weight:700;
          display:flex; align-items:center; gap:8px;
          padding:8px 10px;
          border-radius:8px;
          position:relative;
          transform: translateZ(0);
        }
        .ferret-link:focus { outline: 3px solid rgba(255,216,150,0.18); outline-offset:3px; }
        /* animated underline */
        .ferret-link::after {
          content:""; position:absolute; left:10%; right:10%; bottom:6px; height:3px;
          background: linear-gradient(90deg, rgba(255,230,170,0.95), rgba(210,160,120,0.75));
          border-radius:3px; transform: scaleX(0); transform-origin:left; transition: transform .28s ease;
          opacity:0.95;
        }
        .ferret-link:hover::after, .ferret-link:focus::after { transform: scaleX(1); }

        /* profile area */
        .ferret-profile { display:flex; align-items:center; gap:10px; z-index:1; }
        .ferret-name { color:#fff1d6; font-weight:800; letter-spacing:0.2px; text-shadow: 0 1px 0 rgba(0,0,0,0.45); }
        .ferret-avatar {
          width:36px; height:36px; border-radius:50%;
          display:flex; align-items:center; justify-content:center; font-weight:700;
          font-size:15px; text-transform:uppercase;
          background: linear-gradient(135deg, #e6c892 0%, #d1a46f 60%, #8a5b44 100%);
          color:#3d2218;
          box-shadow: 0 4px 10px rgba(0,0,0,0.35), inset 0 -4px 10px rgba(255,255,255,0.05);
          border: 1px solid rgba(255,230,180,0.06);
        }

        /* hamburger */
        .ferret-hambtn {
          width:44px; height:44px; border-radius:10px; border:none; background:transparent; cursor:pointer;
          display:flex; align-items:center; justify-content:center; color:#fff1d6; transition: transform .18s;
        }
        .ferret-hambtn:active { transform: scale(.95); }

        /* backdrop */
        .ferret-backdrop {
          position:fixed; inset:0; background: rgba(0,0,0,0.32); z-index:1998; transition: opacity .28s;
        }

        /* side menu */
        .ferret-aside {
          position:fixed; top:0; right:0; height:100vh; width:300px; max-width:85vw;
          padding:22px; z-index:2000; display:flex; flex-direction:column; gap:12px;
          transform: translateX(110%); transition: transform .38s cubic-bezier(.22,.9,.2,1);
          box-shadow: -12px 0 30px rgba(0,0,0,0.45);
          border-left: 1px solid rgba(255,255,255,0.03);
        }
        .ferret-aside.open { transform: translateX(0); }

        /* aside background - slightly lighter fur panel */
        .ferret-aside-inner {
          position:relative; inset:0; height:100%; border-radius:6px;
          background:
            linear-gradient(180deg, rgba(255,235,200,0.04), rgba(0,0,0,0.04)),
            linear-gradient(180deg,#5b3f36,#41271f);
          padding:12px;
          display:flex; flex-direction:column;
        }

        .ferret-aside h3 { color:#ffe8a6; margin:6px 0 10px; font-size:1.05rem; letter-spacing:0.3px; }
        .ferret-aside a.action, .ferret-aside button.action {
          display:flex; gap:10px; align-items:center; justify-content:flex-start;
          padding:12px; border-radius:8px; text-decoration:none; color:#fff1d6; font-weight:700;
          border:none; background: rgba(255,220,160,0.06); cursor:pointer;
          transition: transform .18s, box-shadow .18s;
        }
        .ferret-aside a.action:hover, .ferret-aside button.action:hover { transform: translateX(4px); box-shadow: 0 6px 16px rgba(0,0,0,0.45); }
        .ferret-aside .logout { margin-top:10px; background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.06)); }

        /* small responsive */
        @media (max-width:880px) {
          .ferret-links { display:none; }
        }

        /* focus ring for keyboard users */
        a, button { outline: none; }
        a:focus-visible, button:focus-visible { box-shadow: 0 0 0 3px rgba(255,216,150,0.14); border-radius:8px; }
      `}</style>

      {/* NAVBAR */}
      <nav className="ferret-navbar ferret-bg" role="navigation" aria-label="Main navigation">
        {/* LOGO */}
        <div
          className="ferret-left"
          onClick={() => { navigate("/home"); setMenuOpen(false); }}
          title="Ir para home"
        >
          <img
            src="/ferret_scarf.png"
            alt="Ferret Logo"
            className="ferret-logo"
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px) rotate(-2deg)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "")}
            draggable={false}
          />
        </div>

        {/* LINKS */}
        <div className="ferret-links" aria-hidden={menuOpen}>
          <Link to="/eventos" className="ferret-link" title="Eventos">
            <FaBirthdayCake size={16} aria-hidden />
            Eventos
          </Link>

          <Link to="/convites" className="ferret-link" title="Convites">
            Convites
          </Link>

          <Link to="/pagamentos" className="ferret-link" title="Pagamentos">
            Pagamentos
          </Link>

          <Link to="/inscricoes" className="ferret-link" title="Inscrições">
            Inscrições
          </Link>
        </div>

        {/* PROFILE + MENU BUTTON */}
        <div className="ferret-profile" role="group" aria-label="Perfil">
          {firstName && <span className="ferret-name">{firstName}</span>}

          <div className="ferret-avatar" title={usuario?.nome ?? "Usuário"}>
            {firstName ? firstName[0] : "?"}
          </div>

          <button
            className="ferret-hambtn"
            onClick={() => setMenuOpen(true)}
            aria-expanded={menuOpen}
            aria-controls="ferret-side-menu"
            aria-label="Abrir menu"
            title="Abrir menu"
          >
            <FaBars size={18} />
          </button>
        </div>
      </nav>

      {/* spacer so content doesn't go under fixed navbar */}
      <div style={{ height: 70 }} />

      {/* BACKDROP */}
      {menuOpen && (
        <div
          className="ferret-backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
      )}

      {/* SIDE MENU */}
      <aside
        id="ferret-side-menu"
        className={`ferret-aside ${menuOpen ? "open" : ""}`}
        aria-hidden={!menuOpen}
      >
        <div className="ferret-aside-inner" role="menu" aria-label="Menu lateral">
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button
              onClick={() => setMenuOpen(false)}
              style={{ background: "transparent", border: "none", color: "#ffe8a6", cursor: "pointer", padding:8 }}
              aria-label="Fechar menu"
              title="Fechar menu"
            >
              <FaTimes size={18} />
            </button>
          </div>

          <h3>Menu</h3>

          {/* ✔ MANTIVE APENAS PERFIL */}
          <Link to="/perfil" className="action" onClick={() => setMenuOpen(false)}>
            <FaUserCircle /> Gerenciar perfil
          </Link>

          {/* ❌ REMOVIDOS: eventos, convites, pagamentos */}

          {/* ✔ LOGOUT */}
          <button className="action logout" onClick={handleLogout} aria-label="Fazer logout">
            <FaSignOutAlt /> Fazer Logout
          </button>

          <div style={{ marginTop: "auto", color: "rgba(255,235,200,0.7)", fontSize: 12 }}>
            <div style={{ opacity: 0.9, fontWeight:700 }}>Ferret</div>
            <div style={{ opacity: 0.7 }}>você está logado{usuario?.nome ? ` como ${usuario.nome}` : ""}</div>
          </div>
        </div>
      </aside>
    </>
  );
}
