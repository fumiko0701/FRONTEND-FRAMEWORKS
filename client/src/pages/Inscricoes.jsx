import React, { useEffect, useState, useCallback, useRef } from "react";
import api from "../services/api";
import Loading from "../components/Loading";
import GenericLayout from "../components/GenericLayout";
import InscricaoCard from "../components/InscricaoCard";
import FormModal from "../components/FormModal";
import "../styles/inscricoes.css";

export default function Inscricoes() {
  const [Inscricoes, setInsceicoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [cooldown, setCooldown] = useState(false);

  const [modalOpen, setModalOpen] = useState(false);
  const carregouRef = useRef(false);

  useEffect(() => {
    document.title = "Minhas Inscrições";
  }, []);

  const carregarInscricoes = useCallback(async () => {
    setLoading(true);
    setErro("");

    try {
      const resposta = await api.get("/inscricoes");

      const dados = Array.isArray(resposta.data)
        ? resposta.data.map((insc) => ({
            id: insc.id_inscricao ?? insc.id ?? null,
            id_evento: insc.id_evento ?? null,
            id_usuario: insc.id_usuario ?? null,
            data_inscricao: insc.data_inscricao ?? null,
            raw: insc,
          }))
        : [];

      setInsceicoes(dados);
      carregouRef.current = true;
    } catch (error) {
      setErro("Não foi possível carregar as inscrições.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarInscricoes();
  }, [carregarInscricoes]);

  return (
    <GenericLayout title="Minhas Inscrições" onRefresh={carregarInscricoes} cooldown={cooldown} setCooldown={setCooldown}>
      {loading ? (
        <Loading />
      ) : erro ? (
        <div style={{ padding: 24, color: "red" }}>{erro}</div>
      ) : Inscricoes.length === 0 ? (
        <div style={{ padding: 24 }}>Você não possui inscrições.</div>
      ) : (
        Inscricoes.map((insc) => <InscricaoCard key={insc.id} inscricao={insc} />)
      )}

      <FormModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Nova Inscrição"
        fields={[
          { name: "id_evento", label: "ID do Evento", type: "number", required: true },
        ]}
        onSubmit={async (formData) => {
          setErro("");
          try {
            setCooldown(true);
            await api.post("/inscricoes", formData);
            setModalOpen(false);
            carregarInscricoes();
          } catch (error) {
            setErro("Não foi possível criar a inscrição.");
          } finally {
            setCooldown(false);
          }
        }}
      />
    </GenericLayout>
  );
}