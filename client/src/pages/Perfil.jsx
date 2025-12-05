import React, { useState, useEffect } from 'react';
import "../styles/profiles.css";

const ProfileScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 Estados novos
  const [showEditModal, setShowEditModal] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    email: "",
    data_nascimento: "",
    visibilidade: ""
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    let payload;
    try {
      payload = JSON.parse(atob(token.split('.')[1]));
    } catch (err) {
      console.error("Erro ao decodificar token:", err);
      setLoading(false);
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
  }, []);

  // Preenche formData quando user é carregado
  useEffect(() => {
    if (user) {
      setFormData({
        nome: user.nome,
        email: user.email,
        data_nascimento: user.data_nascimento?.split("T")[0] || "",
        visibilidade: user.visibilidade || "ativo"
      });
    }
  }, [user]);

  // 🔥 Atualizar perfil
  const handleUpdateProfile = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`http://localhost:3005/usuarios/${user.id_usuario}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Erro ao atualizar perfil");

      const updatedUser = await res.json();
      setUser(updatedUser);
      setShowEditModal(false);

      alert("Perfil atualizado com sucesso!");
    } catch (error) {
      console.error(error);
      alert("Erro ao atualizar o perfil.");
    }
  };

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

          {/* 🔥 Botão Editar Perfil */}
          <button className="edit-btn" onClick={() => setShowEditModal(true)}>
            Editar Perfil
          </button>
        </div>

        {/* 🔥 INFORMAÇÕES EXTRAS */}
        <div className="profile-extra-info">
          <p>
            <strong>📅 Data de Nascimento:</strong>{" "}
            {user.data_nascimento
              ? new Date(user.data_nascimento).toLocaleDateString()
              : "Não informado"}
          </p>

          <p>
            <strong>👁️ Visibilidade:</strong>{" "}
            {user.visibilidade || "Pública"}
          </p>
        </div>

        {/* ============================
            🔥 MODAL EDITAR PERFIL
        ============================ */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Editar Perfil</h2>

              <label>Nome</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) =>
                  setFormData({ ...formData, nome: e.target.value })
                }
              />

              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />

              <label>Data de Nascimento</label>
              <input
                type="date"
                value={formData.data_nascimento}
                onChange={(e) =>
                  setFormData({ ...formData, data_nascimento: e.target.value })
                }
              />

              <label>Visibilidade</label>
              <select
                value={formData.visibilidade}
                onChange={(e) =>
                  setFormData({ ...formData, visibilidade: e.target.value })
                }
              >
                <option value="ativo">Ativo</option>
                <option value="privado">Privado</option>
              </select>

              <div className="modal-buttons">
                <button className="save-btn" onClick={handleUpdateProfile}>
                  Salvar
                </button>
                <button
                  className="cancel-btn"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfileScreen;
