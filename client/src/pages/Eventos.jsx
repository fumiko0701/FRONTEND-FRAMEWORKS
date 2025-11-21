import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import "../styles/eventos.css";
import Loading from "../components/Loading";   // <<< ADICIONADO

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
  const [loading, setLoading] = useState(true); // <<< já existia
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
            visibilidade: ev.visibilidade ?? null,
            statusInterno: ev.status_interno ?? null,
            raw: ev,
          }))
        : [];
      setEventos(dados);
    } catch (error) {
      console.error("Erro ao carregar eventos:", error);
      if (error?.response) {
        setErro(`Erro ${error.response.status}: ${error.response.statusText || "Problema no servidor"}`);
      } else if (error?.request) {
        setErro("Falha de rede: não foi possível conectar ao servidor.");
      } else {
        setErro("Não foi possível carregar os eventos.");
      }
    } finally {
      setLoading(false); // <<< ativa/desativa o loader
    }
  }, []);

  useEffect(() => {
    carregarEventos();
  }, [carregarEventos]);

  return (
    <>
      {/* LOADING UNIVERSAL */}
      <Loading active={loading} />

      {erro && (
        <div style={{ padding: 12 }}>
          <p style={{ color: "red" }}>{erro}</p>
          <button onClick={carregarEventos}>Tentar novamente</button>
        </div>
      )}

      <div className="eventos-container">
        <h1>Eventos Disponíveis</h1>

        <div style={{ marginBottom: 12 }}>
          <button onClick={carregarEventos}>Atualizar</button>
        </div>

        {eventos.length === 0 && !loading ? (
          <p>Nenhum evento encontrado.</p>
        ) : (
          <ul className="eventos-lista">
            {eventos.map((ev) => (
              <li key={ev.id ?? Math.random()} className="evento-item">
                <h3>{ev.titulo}</h3>
                <p>{ev.descricao}</p>
                <div style={{ fontSize: 13, color: "#444" }}>
                  <strong>Período:</strong> {formatDateRange(ev.dataInicio, ev.dataFim)}
                </div>
                {ev.visibilidade && (
                  <div style={{ fontSize: 12, color: ev.visibilidade === "ativo" ? "green" : "gray" }}>
                    Visibilidade: {ev.visibilidade} {ev.statusInterno ? `· ${ev.statusInterno}` : ""}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
