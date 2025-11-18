// /client/src/components/Navbar.jsx
import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav style={{ padding: 10, background: "#eee" }}>
      <Link to="/">Home</Link> |{" "}
      <Link to="/eventos">Eventos</Link> |{" "}
      <Link to="/login">Login</Link>
    </nav>
  );
}
