import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import "../styles/eventos.css";
import Loading from "../components/Loading";

function formatDateRange(startIso, endIso) {
  try {
    const start = startIso ? new Date(startIso) : null;
    const end = endIso ? new Date(endIso) : null;
    const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };

    if (start && end) {
      const sameDay = start.toDateString() === end.toDateString();
      if (sameDay) {
        return `${start.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })} · ${start.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} — ${end.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
      }
      return `${start.toLocaleString(undefined, options)} — ${end.toLocaleString(undefined, options)}`;
    } else if (start) {
      return start.toLocaleString(undefined, options);
    } else if (end) {
      return end.toLocaleString(undefined, options);
    }
    return "Data indisponível";
  } catch {
    return "Data inválida";
  }
}

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  const carregarEventos = useCallback(async () => {
    setLoading(true);
    setErro("");
    try {
      const resposta = await api.get("/eventos");
      const dados = Array.isArray(resposta.data)
        ? resposta.data.map((ev) => ({
            id: ev.id_evento ?? ev.id ?? null,
            titulo: ev.titulo ?? "Sem título",
            descricao: ev.descricao ?? "",
            dataInicio: ev.data_inicio ?? ev.data ?? null,
            dataFim: ev.data_fim ?? null,
          }))
        : [];

      setEventos(dados);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      setErro("Não foi possível carregar os eventos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarEventos();
  }, [carregarEventos]);

  return (
    <>
      <Loading active={loading} />

      {/* 🔶 HEADER BONITO */}
      <header className="eventos-header">
        <h1>Eventos Disponíveis</h1>
      </header>

      {erro && (
        <div className="erro-box">
          <p>{erro}</p>
          <button onClick={carregarEventos}>Tentar novamente</button>
        </div>
      )}

      <div className="eventos-container">
        <div className="top-actions">
          <button className="btn-refresh" onClick={carregarEventos}>
            Atualizar Lista
          </button>
        </div>

        {eventos.length === 0 && !loading ? (
          <p className="nenhum-evento">Nenhum evento encontrado.</p>
        ) : (
          <ul className="eventos-lista">
            {eventos.map((ev) => (
              <li key={ev.id} className="evento-item">
                <div className="evento-star">⭐</div>
                <div className="evento-info">
                  <h3>{ev.titulo}</h3>
                  <p className="descricao">{ev.descricao}</p>
                  <p className="periodo">
                    <strong>Período:</strong> {formatDateRange(ev.dataInicio, ev.dataFim)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
