import React, { useState, useRef } from "react";

export default function RemoteSelect({
  field,
  value,
  onSelect,
  activeField,
  setActiveField
}) {
  const [list, setList] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const lastFetch = useRef(0);

  const isOpen = activeField === field.name;
  const displayLabel = value?.label || "";

  // URL base do backend
  const backendURL = process.env.REACT_APP_API_URL?.replace(/\/$/, "") || "";

  async function loadData() {
    const now = Date.now();
    setActiveField(field.name);

    if (now - lastFetch.current < 5000 && list.length > 0) return;

    setLoadingList(true);
    try {
      const data = await field.fetchFn();

      const parsed = (data || []).map((item, idx) => {
        const id =
          item.id ??
          item.id_local ??
          item.id_categoria ??
          item.id_usuario ??
          item.id_evento ??
          idx;

        // Corrige URL da imagem
        let image = item.image ?? item.icon ?? item.imagem ?? null;
        if (image && image.startsWith("/")) {
          image = backendURL + image;
        }

        return {
          id,
          label: item.label ?? item.nome ?? item.titulo ?? `Item ${id}`,
          desc: item.desc ?? item.endereco ?? item.descricao ?? "",
          image,
          raw: item,
        };
      });

      setList(parsed);
      lastFetch.current = now;
    } catch (err) {
      // erro silencioso ao carregar opções remotas
    } finally {
      setLoadingList(false);
    }
  }

  function handleSelect(item) {
    onSelect({
      id: item.id,
      label: item.label,
      image: item.image,
      raw: item.raw,
    });
    setActiveField(null);
  }

  const inputStyle = {
    padding: 10,
    borderRadius: 10,
    border: "1px solid #3b312a",
    background: "#111214",
    color: "#fff",
    cursor: "pointer",
    width: "100%",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
      <input
        readOnly
        aria-label={field.label}
        value={displayLabel}
        placeholder="Clique para selecionar..."
        onClick={loadData}
        style={inputStyle}
      />

      {isOpen && (
        <div
          style={{
            background: "#17181a",
            border: "1px solid #2f2822",
            marginTop: 8,
            borderRadius: 10,
            padding: 8,
            maxHeight: 260,
            overflowY: "auto",
            position: "absolute",
            width: "100%",
            zIndex: 40,
            boxShadow: "0 8px 20px rgba(0,0,0,0.6)",
          }}
        >
          {loadingList && (
            <div style={{ color: "#aaa", padding: 8 }}>Carregando...</div>
          )}

          {!loadingList &&
            (list.length === 0 ? (
              <div style={{ color: "#aaa", padding: 8 }}>Nenhum item encontrado.</div>
            ) : (
              list.map((item) => (
                <div
                  key={String(item.id)}
                  onClick={() => handleSelect(item)}
                  style={{
                    padding: "10px 8px",
                    borderBottom: "1px solid rgba(60,50,45,0.18)",
                    cursor: "pointer",
                    color: "#efe6da",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  {/* IMAGEM */}
                  {item.image && (
                    <img
                      src={item.image}
                      alt="icone"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        objectFit: "cover",
                        border: "1px solid #3b312a",
                      }}
                    />
                  )}

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontWeight: 700 }}>{item.label}</div>
                    {item.desc && (
                      <div style={{ color: "#b9a891", fontSize: 12 }}>{item.desc}</div>
                    )}
                  </div>
                </div>
              ))
            ))}
        </div>
      )}
    </div>
  );
}
