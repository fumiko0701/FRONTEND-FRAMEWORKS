import React, { useState, useEffect } from 'react';
import "../styles/profiles.css";

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Se não tiver token, já para aqui
    if (!token) {
      setLoading(false);
      return;
    }

    // Decodifica o payload do JWT para pegar o id_usuario
    let payload;
    try {
      payload = JSON.parse(atob(token.split('.')[1]));
    } catch (err) {
      console.error("Erro ao decodificar token:", err);
      setLoading(false);
      return;
    }

    const idUsuario = payload.id_usuario;

    // Faz a requisição usando a rota já existente no backend
    fetch(`http://localhost:3005/usuarios/${idUsuario}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error("Erro ao buscar perfil");
        }
        return res.json();
      })
      .then(data => {
        setUser(data); // Já vem o usuário completo
        setLoading(false);
      })
      .catch(error => {
        console.error("Erro ao buscar perfil:", error);
        setLoading(false);
      });
  }, []);

  // Tela de loading
  if (loading) return <div className="loading">Carregando...</div>;

  // Caso dê erro (user null)
  if (!user) return <div className="error">Erro ao carregar perfil.</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={user.avatar || '/default-avatar.png'}
          alt="Avatar"
          className="avatar"
        />
        <h1 className="name">{user.nome}</h1>
        <p className="email">{user.email}</p>
      </div>

      <div className="profile-details">
        <h2>Sobre</h2>
        <p className="bio">{user.bio || 'Nenhuma bio adicionada.'}</p>
        <button className="edit-button">Editar Perfil</button>
      </div>
    </div>
  );
};

export default ProfileScreen;
