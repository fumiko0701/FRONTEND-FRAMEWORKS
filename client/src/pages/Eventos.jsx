// /client/src/pages/Eventos.jsx
import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/eventos.css";

export default function Eventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarEventos() {
      try {
        const resposta = await api.get("/eventos");
        setEventos(resposta.data);
      } catch (error) {
        console.error(error);
        setErro("Não foi possível carregar os eventos.");
      } finally {
        setLoading(false);
      }
    }

    carregarEventos();
  }, []);

  if (loading) return <p>Carregando eventos...</p>;
  if (erro) return <p style={{ color: "red" }}>{erro}</p>;

  return (
    <div className="eventos-container">
      <h1>Eventos Disponíveis</h1>

      {eventos.length === 0 ? (
        <p>Nenhum evento encontrado.</p>
      ) : (
        <ul className="eventos-lista">
          {eventos.map((ev, index) => (
            <li key={ev.id ?? index} className="evento-item">
              <h3>{ev.titulo}</h3>
              <p>{ev.descricao}</p>
              <span>Data: {ev.data}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
