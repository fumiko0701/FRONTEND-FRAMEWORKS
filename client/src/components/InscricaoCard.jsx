import React from "react";
import PropTypes from "prop-types";
import "../styles/inscricoes.css";

export default function InscricaoCard({ inscricao, onCancel }) {
  return (
    <div className="inscricao-card">
      <h2>Inscrição #{inscricao.id}</h2>
      <p><strong>Evento ID:</strong> {inscricao.id_evento}</p>
      <p><strong>Usuário ID:</strong> {inscricao.id_usuario}</p>
      <p><strong>Data da Inscrição:</strong> {new Date(inscricao.data_inscricao).toLocaleDateString()}</p>
      <button onClick={() => onCancel(inscricao.id)}>Cancelar Inscrição</button>
    </div>
  );
}

InscricaoCard.propTypes = {
  inscricao: PropTypes.shape({
    id: PropTypes.number.isRequired,
    id_evento: PropTypes.number,
    id_usuario: PropTypes.number,
    data_inscricao: PropTypes.string,
  }).isRequired,
  onCancel: PropTypes.func.isRequired,
};