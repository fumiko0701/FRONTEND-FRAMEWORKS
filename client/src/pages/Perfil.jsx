import React, { useState, useEffect } from 'react';
import "../styles/profiles.css"; // Arquivo CSS para estilos (veja abaixo)

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula chamada para API (substitua pela sua URL real)
    fetch('http://localhost:3005/api/user/profile', {
})// Ex.: http://localhost:3001/api/user/profile
      .then(response => response.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erro ao buscar perfil:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="loading">Carregando...</div>;

  if (!user) return <div className="error">Erro ao carregar perfil.</div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img src={user.avatar || '/default-avatar.png'} alt="Avatar" className="avatar" />
        <h1 className="name">{user.name}</h1>
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