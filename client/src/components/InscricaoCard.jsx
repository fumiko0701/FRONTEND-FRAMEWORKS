import React from "react";
import PropTypes from "prop-types";
import "../styles/inscricoes.css";

export default function InscricaoCard({ inscricao, onCancel, eventoTitle, usuarioNome, inscricaoNumber }) {
  const id = inscricao.id ?? inscricao.id_inscricao;
  const data = inscricao.data_inscricao || inscricao.raw?.data_inscricao;
  const status = inscricao.status || inscricao.raw?.status;

  const title =
    eventoTitle ||
    inscricao.raw?.titulo ||
    inscricao.raw?.evento?.titulo ||
    inscricao.evento_nome ||
    inscricao.raw?.evento_nome ||
    inscricao.raw?.nome ||
    null;

  const usuarioDisplay =
    usuarioNome ||
    inscricao.raw?.usuario?.nome ||
    inscricao.raw?.usuario_nome ||
    inscricao.id_usuario ||
    null;

  return (
    <div className="inscricao-card">
      <div className="inscricao-left">
        <div className="titulo">Inscrição #{inscricaoNumber ?? id}</div>
        <div className="meta">
          <strong>Evento:</strong>{" "}
          {title ? <span>{title}</span> : <span>Ver evento</span>}
        </div>

        {usuarioDisplay && <div className="meta"><strong>Usuário:</strong> {usuarioDisplay}</div>}
        {data && <div className="meta"><strong>Data:</strong> {new Date(data).toLocaleString()}</div>}
      </div>

      <div className="inscricao-right">
        {status && <div className="meta" style={{ marginRight: 8 }}><strong>Status:</strong> {status}</div>}
        {onCancel && (
          <button className="inscricao-action ghost" onClick={() => onCancel(id)}>Cancelar</button>
        )}
      </div>
    </div>
  );
}

InscricaoCard.propTypes = {
  inscricao: PropTypes.object.isRequired,
  onCancel: PropTypes.func,
};