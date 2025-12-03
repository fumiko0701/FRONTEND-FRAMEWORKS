import { createContext, useContext, useEffect, useState } from "react";
import { getUserLogged } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregar = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await getUserLogged();
        setUsuario(res.data.usuario);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };

    carregar();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
