import React, { useEffect, useState, useCallback } from "react";
import api from "../services/api";
import Loading from "../components/Loading";
import GenericLayout from "../components/GenericLayout";
import InscricaoCard from "../components/InscricaoCard";
import FormModal from "../components/FormModal";
import "../styles/inscricoes.css";

export default function Inscricoes() {
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [cooldown, setCooldown] = useState(false);
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [formEvent, setFormEvent] = useState(null);
  const [isAuth, setIsAuth] = useState(Boolean(localStorage.getItem("token")));
  const [usuarioNome, setUsuarioNome] = useState(null);

  useEffect(() => {
    document.title = "Minhas Inscrições";
  }, []);

  const carregarInscricoes = useCallback(async () => {
    setLoading(true);
    setErro("");

    try {
      const res = await api.get("/inscricoes/minhas");
      const data = Array.isArray(res.data)
        ? res.data.map((i) => ({
            id: i.id_inscricao ?? i.id ?? null,
            id_evento: i.id_evento ?? null,
            id_usuario: i.id_usuario ?? null,
            status: i.status ?? null,
            data_inscricao: i.data_inscricao ?? i.data_inscricao,
            raw: i,
          }))
        : [];

      // ordenar por data_inscricao (mais antiga -> mais recente) para manter ordem previsível
      const sorted = data.slice().sort((a, b) => {
        const da = a.data_inscricao || a.raw?.data_inscricao || null;
        const db = b.data_inscricao || b.raw?.data_inscricao || null;
        const ta = da ? new Date(da).getTime() : 0;
        const tb = db ? new Date(db).getTime() : 0;
        return ta - tb;
      });
      setInscricoes(sorted);
    } catch (err) {
      const serverMsg = err.response?.data?.erro || err.response?.data?.message;
      setErro(serverMsg || "Não foi possível carregar as inscrições.");
      console.error("[Inscricoes] erro ao carregar:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const carregarEventos = useCallback(async () => {
    setLoadingEvents(true);
    try {
      const res = await api.get("/eventos");
      const data = Array.isArray(res.data) ? res.data : [];
      // show only events that can be registered (public)
      const available = data.filter((e) => !e.visibilidade || e.visibilidade === "publico");
      setEvents(available);
    } catch (err) {
      console.error("[Inscricoes] erro ao carregar eventos:", err.response?.data || err.message);
      setEvents([]);
    } finally {
      setLoadingEvents(false);
    }
  }, []);

  const carregarUsuario = useCallback(async () => {
    try {
      const res = await api.get('/auth/me');
      const u = res.data?.usuario || {};
      const nome = u.nome || u.nome_completo || u.nome_usuario || u.username || u.name || null;
      setUsuarioNome(nome);
    } catch (err) {
      setUsuarioNome(null);
    }
  }, []);

  useEffect(() => {
    carregarInscricoes();
    carregarEventos();
    carregarUsuario();
    // observe token changes in localStorage (simple polling)
    const t = setInterval(() => {
      const has = Boolean(localStorage.getItem("token"));
      setIsAuth(has);
    }, 1000);

    return () => clearInterval(t);
  }, [carregarInscricoes, carregarEventos, carregarUsuario]);

  

  return (
    <GenericLayout title="Minhas Inscrições" onRefresh={carregarInscricoes} cooldown={cooldown} setCooldown={setCooldown}>
      {/* removed global "Nova Inscrição" button - use per-event Inscrever */}

      <div style={{ padding: 12, maxWidth: 1100, margin: '0 auto' }}>
        <h3 style={{ marginBottom: 8, color: '#3e2723' }}>Eventos disponíveis</h3>
        {!isAuth && (
          <div style={{ marginBottom: 8, color: '#a33' }}>
            Faça login para poder inscrever-se nos eventos. <a href="/login">Entrar</a>
          </div>
        )}
        {loadingEvents ? (
          <div className="inscricao-empty">Carregando eventos...</div>
        ) : events.length === 0 ? (
          <div className="inscricao-empty">Nenhum evento disponível para inscrição.</div>
        ) : (
          <div className="inscricoes-lista">
            {events.map((ev) => {
              const id = ev.id_evento ?? ev.id ?? ev.id_evento;
              return (
                <div key={String(id)} className="inscricao-card">
                  <div className="inscricao-left">
                    <div className="titulo">{ev.titulo ?? ev.nome ?? `Evento ${id}`}</div>
                    {ev.descricao && <div className="meta">{ev.descricao}</div>}
                    {ev.dataInicio && <div className="meta">{new Date(ev.dataInicio).toLocaleString()}</div>}
                  </div>
                  <div className="inscricao-right">
                    <button
                      className="inscricao-action"
                      onClick={() => {
                          if (!isAuth) return;
                          setFormEvent({ id: id, title: ev.titulo ?? ev.nome ?? String(id) });
                          setFormOpen(true);
                        }}
                      disabled={!isAuth}
                      title={isAuth ? `Inscrever em ${ev.titulo ?? ev.nome ?? id}` : 'Faça login para se inscrever'}
                    >
                      Inscrever
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {loading ? (
        <Loading />
      ) : erro ? (
        <div style={{ padding: 24, color: "red" }}>{erro}</div>
      ) : inscricoes.length === 0 ? (
        <div className="inscricao-empty">Você não possui inscrições.</div>
      ) : (
        <div className="inscricoes-lista">
          {inscricoes.map((insc, idx) => {
            // try to resolve event title from several sources: server-side raw payload or local events list
            const evId = insc.id_evento || insc.raw?.id_evento || insc.raw?.evento?.id || null;
            const fromRaw = insc.raw?.titulo || insc.raw?.evento?.titulo || insc.evento_nome || insc.raw?.evento_nome || insc.raw?.nome || null;
            let resolvedTitle = fromRaw;
            if (!resolvedTitle && evId) {
              const found = events.find((e) => (e.id_evento ?? e.id) === evId);
              if (found) resolvedTitle = found.titulo || found.nome || null;
            }

            return (
              <InscricaoCard
                key={insc.id}
                inscricao={insc}
                eventoTitle={resolvedTitle}
                usuarioNome={usuarioNome}
                inscricaoNumber={idx + 1}
              />
            );
          })}
        </div>
      )}

      <FormModal
        open={formOpen}
        onClose={() => { setFormOpen(false); setFormEvent(null); }}
        submitText="Confirmar Inscrição"
        fields={[
          { name: 'id_evento', label: 'id_evento', type: 'hidden', defaultValue: formEvent ? formEvent.id : '' },
          { name: 'evento_nome', label: 'Evento', type: 'text', required: true, defaultValue: formEvent ? formEvent.title : '', readOnly: true },
          { name: 'assento', label: 'Assento', type: 'text' },
          { name: 'secao', label: 'Seção', type: 'text' },
        ]}
        onSubmit={async (formData) => {
          setErro('');
          if (!isAuth) {
            setErro('Você precisa estar logado para se inscrever.');
            setFormOpen(false);
            return;
          }

          // montar payload: id_evento, id_usuario (se possível), status, assento, secao
          const idEventoNum = Number(formData.id_evento || (formEvent && formEvent.id));
          if (!idEventoNum || isNaN(idEventoNum) || idEventoNum <= 0) {
            setErro('ID do evento inválido.');
            return;
          }

          try {
            // tentar obter usuario
            let usuarioId = null;
            try {
              const me = await api.get('/auth/me');
              usuarioId = me.data?.usuario?.id_usuario || me.data?.usuario?.id || null;
            } catch (meErr) {
              console.warn('[Inscricoes] não foi possível obter /auth/me antes do POST:', meErr?.response?.data || meErr.message);
            }

            const payload = {
              id_evento: idEventoNum,
              status: 'pendente'
            };

            if (usuarioId) payload.id_usuario = Number(usuarioId);
            if (formData.assento) payload.assento = String(formData.assento);
            if (formData.secao) payload.secao = String(formData.secao);

            // envio de payload para /inscricoes
            await api.post('/inscricoes', payload);
            setFormOpen(false);
            setFormEvent(null);
            await carregarInscricoes();
          } catch (err) {
            const resp = err.response;
            const serverMsg = resp?.data?.erro || resp?.data?.message || err.message;
            console.error('[Inscricoes] erro ao criar inscrição:', resp ? JSON.stringify(resp.data) : err.message, 'status:', resp?.status);
            setErro(serverMsg || 'Não foi possível criar a inscrição.');
          }
        }}
      />
    </GenericLayout>
  );
}
