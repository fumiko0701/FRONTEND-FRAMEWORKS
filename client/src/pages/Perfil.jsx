import React, { useState, useEffect } from 'react';
import "../styles/profiles.css";

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  // const [events, setEvents] = useState([]); // REMOVIDO
  const [loading, setLoading] = useState(true);
  // const [eventsLoading, setEventsLoading] = useState(true); // REMOVIDO

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      // setEventsLoading(false); // REMOVIDO
      return;
    }

    let payload;
    try {
      payload = JSON.parse(atob(token.split('.')[1]));
    } catch (err) {
      console.error("Erro ao decodificar token:", err);
      setLoading(false);
      // setEventsLoading(false); // REMOVIDO
      return;
    }

    const idUsuario = payload.id_usuario;

    // Busca usuário
    fetch(`http://localhost:3005/usuarios/${idUsuario}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao buscar perfil");
        return res.json();
      })
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar perfil:", error);
        setLoading(false);
      });

    // A busca de eventos criada pelo usuário foi REMOVIDA
    /*
    fetch(`http://localhost:3005/eventos/usuario/${idUsuario}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao buscar eventos");
        return res.json();
      })
      .then(data => {
        setEvents(data);
        setEventsLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar eventos:", error);
        setEventsLoading(false);
      });
    */
  }, []);

  if (loading) return <div className="loading">Carregando perfil...</div>;
  if (!user) return <div className="error">Erro ao carregar perfil.</div>;

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* HEADER */}
        <div className="profile-header">
          <img
            src={user.avatar || '/default-avatar.png'}
            alt="Avatar"
            className="avatar"
          />
          <h1 className="name">{user.nome}</h1>
          <p className="email">{user.email}</p>
        </div>

        {/* 🔥 INFORMAÇÕES EXTRAS */}
        <div className="profile-extra-info">
          <p>
            <strong>📅 Data de Nascimento:</strong>{" "}
            {user.data_nascimento ? new Date(user.data_nascimento).toLocaleDateString() : "Não informado"}
          </p>

          <p>
            <strong>👁️ Visibilidade:</strong>{" "}
            {user.visibilidade || "Pública"}
          </p>
        </div>

        {/* A seção de EVENTOS (events-section) foi REMOVIDA */}

      </div>
    </div>
  );
};

export default ProfileScreen;