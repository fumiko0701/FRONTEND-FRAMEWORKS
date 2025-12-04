// src/pages/Eventos.jsx
import React, { useEffect, useState, useCallback, useRef } from "react";
import api from "../services/api";
import Loading from "../components/Loading";
import GenericLayout from "../components/GenericLayout";
import EventCard from "../components/EventCard";
import FormModal from "../components/FormModal";

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [cooldown, setCooldown] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const carregouRef = useRef(false);

  useEffect(() => {
    document.title = "Eventos Disponíveis";
  }, []);

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
            id_categoria: ev.id_categoria,
            raw: ev,
          }))
        : [];

      setEventos(dados);
      carregouRef.current = true;
    } catch (error) {
      setErro("Não foi possível carregar os eventos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarEventos();
  }, [carregarEventos]);

  const criarEventoFields = [
    { name: "titulo", label: "Título", type: "text", required: true },
    { name: "descricao", label: "Descrição", type: "text", required: true },
    { name: "data_inicio", label: "Data início", type: "datetime-local", required: true },
    { name: "data_fim", label: "Data fim", type: "datetime-local", required: true },

    {
      name: "id_local",
      label: "Local",
      type: "remote-select",
      required: true,
      fetchFn: async () => {
        const res = await api.get("/locais");
        return res.data.map((loc) => ({
          id: loc.id_local,
          label: loc.nome,
          desc: loc.endereco ?? "",
        }));
      },
    },

    {
      name: "id_categoria",
      label: "Categoria",
      type: "remote-select",
      required: true,
      fetchFn: async () => {
        const res = await api.get("/categorias");
        return res.data.map((c) => ({
          id: c.id_categoria,
          label: c.nome,
          desc: c.descricao ?? "",
          image: c.icon,
        }));
      },
    },

    {
      name: "visibilidade",
      label: "Visibilidade",
      type: "select",
      required: true,
      options: [
        { id: "publico", label: "Público" },
        { id: "privado", label: "Privado" },
      ],
    },
  ];

  async function criarEventoSubmit(values) {
    const payload = {
      titulo: values.titulo,
      descricao: values.descricao,
      data_inicio: values.data_inicio,
      data_fim: values.data_fim,
      visibilidade: values.visibilidade,
      id_local: values.id_local?.id ?? null,
      id_categoria: values.id_categoria?.id ?? null,
    };

    try {
      await api.post("/eventos", payload);
      setModalOpen(false);
      carregouRef.current = false;
      carregarEventos();
    } catch (err) {
      console.error("Erro ao criar evento:", err);
      setErro(err.response?.data?.erro || "Erro ao criar evento.");
    }
  }

  const handleAtualizarClick = async () => {
    if (cooldown) return;
    setCooldown(true);
    await carregarEventos();
    setTimeout(() => setCooldown(false), 5000);
  };

  return (
    <>
      <Loading active={loading} />

      {erro && <p style={{ color: "red", padding: 12 }}>{erro}</p>}

      <GenericLayout
        left={
          <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "160px" }}>
            <h3>Meus eventos</h3>
            <button
              style={{
                padding: "10px 16px",
                borderRadius: 8,
                border: "none",
                background: "#5a382e",
                color: "#ffe8a6",
                cursor: "pointer",
                fontWeight: 700,
                transition: "0.2s",
              }}
              onClick={() => setModalOpen(true)}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#4e2920")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#5a382e")}
            >
              Criar evento
            </button>
          </div>
        }
        center={
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h2>Eventos Públicos</h2>
              <button
                style={{
                  padding: "8px 14px",
                  borderRadius: 8,
                  border: "none",
                  background: cooldown ? "#3e2723" : "#5a382e",
                  color: "#ffe8a6",
                  cursor: cooldown ? "not-allowed" : "pointer",
                  fontWeight: 700,
                  transition: "0.2s",
                }}
                onClick={handleAtualizarClick}
                disabled={cooldown}
                onMouseEnter={(e) => !cooldown && (e.currentTarget.style.background = "#4e2920")}
                onMouseLeave={(e) => !cooldown && (e.currentTarget.style.background = "#5a382e")}
              >
                {cooldown ? "Aguarde..." : "Atualizar"}
              </button>
            </div>

            <div
              style={{
                maxHeight: "650px",
                overflowY: "auto",
                padding: "16px",
                borderRadius: "12px",
                backgroundColor: "#3b1f12",
                position: "relative",
              }}
              className="custom-scroll"
            >
              {/* Gradiente discreto nas bordas usando pseudo-elemento */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: "12px",
                  pointerEvents: "none",
                  background: "linear-gradient(45deg, rgba(245,245,245,0.25), transparent 10%) top left, " +
                              "linear-gradient(-45deg, rgba(245,245,245,0.25), transparent 10%) top right, " +
                              "linear-gradient(45deg, rgba(245,245,245,0.25), transparent 10%) bottom left, " +
                              "linear-gradient(-45deg, rgba(245,245,245,0.25), transparent 10%) bottom right",
                  backgroundRepeat: "no-repeat",
                  backgroundSize: "30px 30px",
                }}
              />

              <div style={{ display: "flex", flexDirection: "column", gap: 16, padding: "4px" }}>
                {eventos.map((ev) => (
                  <EventCard key={ev.id} ev={ev} />
                ))}
              </div>
            </div>
          </div>
        }
      />

      <FormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        fields={criarEventoFields}
        onSubmit={criarEventoSubmit}
        submitText="Criar evento"
      />

      <style>{`
        /* Scroll personalizado */
        .custom-scroll::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: rgba(0,0,0,0);
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background-color: #5a382e;
          border-radius: 6px;
        }
        .custom-scroll {
          scrollbar-width: thin;
          scrollbar-color: #5a382e transparent;
          scroll-behavior: smooth;
        }
      `}</style>
    </>
  );
}
