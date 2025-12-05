import React, { useEffect, useState } from "react";
import api from "../services/api";
import Loading from "../components/Loading";
import GenericLayout from "../components/GenericLayout";
import "../styles/inscricoes.css"

export default function Inscricoes() {
  const [inscricoes, setInscricoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    document.title = "Minhas Inscrições";
    carregarInscricoes();
  }, []);

  const carregarInscricoes = async () => {
    setLoading(true);
    setErro("");

    try {
      const resposta = await api.get("/inscricoes/minhas");
      setInscricoes(resposta.data);
    } catch (error) {
      setErro("Erro ao carregar inscrições. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const cancelarInscricao = async (id) => {
    try {
      await api.delete(`/inscricoes/${id}`);
      setInscricoes((prev) => prev.filter((inscricao) => inscricao.id !== id));
    } catch (error) {
      alert("Erro ao cancelar inscrição.");
    }
  };

  if (loading) return <Loading />;

  return (
    <GenericLayout>
      <h1>Minhas Inscrições</h1>
      {erro && <p className="erro">{erro}</p>}
      <div className="inscricoes-container">
        {inscricoes.length === 0 ? (
          <p>Você não possui inscrições.</p>
        ) : (
          inscricoes.map((inscricao) => (
            <div key={inscricao.id} className="inscricao-card">
              <h2>{inscricao.eventoTitulo}</h2>
              <p>{inscricao.eventoDescricao}</p>
              <button onClick={() => cancelarInscricao(inscricao.id)}>
                Cancelar Inscrição
              </button>
            </div>
          ))
        )}
      </div>
    </GenericLayout>
  );
}
