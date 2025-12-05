// src/context/CategoriaContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const CategoriaContext = createContext();

export function CategoriaProvider({ children }) {
  const [categorias, setCategorias] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const res = await api.get("/categorias");
        setCategorias(res.data);
      } catch (err) {
        // erro silencioso ao carregar categorias
      } finally {
        setLoaded(true);
      }
    }

    if (!loaded) fetchCategorias();
  }, [loaded]);

  return (
    <CategoriaContext.Provider value={{ categorias }}>
      {children}
    </CategoriaContext.Provider>
  );
}

export function useCategorias() {
  return useContext(CategoriaContext);
}
