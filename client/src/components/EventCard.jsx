// src/components/EventCard.jsx
import React, { useMemo } from "react";
import "../styles/eventos.css";
import { formatDateRange } from "../services/dateFormat";
import { useAuth } from "../context/AuthContext";
import { useCategorias } from "../context/CategoriaContext";
import { FaMapMarkerAlt, FaUser } from "react-icons/fa";

export default function EventCard({ ev }) {
  const { usuario } = useAuth();
  const { categorias } = useCategorias();

  const criadorID =
    ev.raw?.id_usuario_criador ??
    ev.raw?.id_criador ??
    ev.raw?.id_usuario;

  const isMeuEvento =
    usuario &&
    criadorID &&
    Number(usuario.id_usuario ?? usuario.id) === Number(criadorID);

  // Backend base URL (usa a mesma do axios)
  const backendURL = process.env.REACT_APP_API_URL?.replace(/\/$/, "") || "";

  // Encontra categoria referente ao evento
  const categoria = useMemo(() => {
    return categorias.find((c) => c.id_categoria === ev.raw?.id_categoria);
  }, [categorias, ev.raw?.id_categoria]);

  // Monta URL do ícone
  const categoriaIconURL =
    categoria?.icon ? `${backendURL}${categoria.icon}` : null;

  return (
    <div className="evento-item" style={{ position: "relative" }}>
      {isMeuEvento && <div className="meu-evento-ribbon">MEU EVENTO</div>}

      <h3 style={{ marginBottom: 6 }}>{ev.titulo}</h3>
      <p style={{ marginTop: 0, marginBottom: 10, color: "#584033" }}>
        {ev.descricao}
      </p>

      <div className="periodo">
        <strong>Período:</strong>{" "}
        {formatDateRange(ev.dataInicio, ev.dataFim)}
      </div>

      <div className="tag-box" style={{ marginTop: 10 }}>
        {/* Local */}
        <span className="tag tag-local" title={ev.raw?.local_endereco}>
          <FaMapMarkerAlt style={{ marginRight: 6 }} />
          {ev.raw?.local_nome}
        </span>

        {/* Categoria */}
        <span
          className="tag tag-categoria"
          title={categoria?.descricao ?? "Categoria"}
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          {categoriaIconURL ? (
            <img
              src={categoriaIconURL}
              alt={categoria?.nome}
              style={{
                width: 18,
                height: 18,
                objectFit: "contain",
                borderRadius: 4,
              }}
            />
          ) : (
            <div
              style={{
                width: 18,
                height: 18,
                background: "#ccc",
                borderRadius: 4,
              }}
            />
          )}

          {categoria?.nome ?? "Categoria"}
        </span>

        {/* Criador */}
        <span className="tag tag-criador" title={ev.raw?.criador_email}>
          <FaUser style={{ marginRight: 6 }} />
          {ev.raw?.criador_nome}
        </span>
      </div>

      {ev.visibilidade && (
        <div
          className={`visibilidade ${
            ev.visibilidade === "publico"
              ? "vis-publico"
              : "vis-privado"
          }`}
          style={{ marginTop: 10 }}
        >
          {ev.visibilidade === "publico" ? "Público" : "Privado"}
        </div>
      )}
    </div>
  );
}
