// arquivo: client/src/services/api.js
import axios from "axios";

// TOKEN TEMPORÁRIO FIXO (para testes)
const TOKEN_TESTE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjoxMiwiZW1haWwiOiJ3YWxsc2NvdmVyZWRpbmJsb29kQGFsdGVyLm55YSIsInRpcG8iOiJvcmdhbml6YWRvciIsImlhdCI6MTc2MzQyOTYwMCwiZXhwIjoxNzYzNDM2ODAwfQ.vDjwU021PdvN_r5ITdeFGDDuS7Ln9GSN7vy4YKzYqto";

// Use variável de ambiente para poder apontar para backend remoto quando necessário
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3001";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
});

// envia token do usuário se existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// retry interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    config.__retryCount = config.__retryCount || 0;
    const MAX_RETRIES = 3;

    const shouldRetry =
      !error.response ||
      (error.response && (error.response.status >= 500 || error.response.status === 429));

    if (shouldRetry && config.__retryCount < MAX_RETRIES) {
      config.__retryCount += 1;
      const delay = Math.min(2000 * 2 ** (config.__retryCount - 1), 8000);
      await new Promise((res) => setTimeout(res, delay));
      return api(config);
    }

    return Promise.reject(error);
  }
);

// --- FUNÇÕES DE AUTENTICAÇÃO ---
export const loginUser = (email, senha) => api.post("/auth/login", { email, senha });
export const registerUser = (dados) => api.post("/register", dados);
export const logoutUser = () => api.post("/logout");

export default api;
