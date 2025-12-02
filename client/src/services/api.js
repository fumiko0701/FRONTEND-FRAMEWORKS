// client/src/services/api.js
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
});

// Adiciona token automaticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Retry automático
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const config = error.config;
    if (!config) return Promise.reject(error);

    config.__retryCount = config.__retryCount || 0;
    const MAX_RETRIES = 3;

    const shouldRetry =
      !error.response ||
      error.response.status >= 500 ||
      error.response.status === 429;

    if (shouldRetry && config.__retryCount < MAX_RETRIES) {
      config.__retryCount++;
      await new Promise((res) => setTimeout(res, 1000 * config.__retryCount));
      return api(config);
    }

    return Promise.reject(error);
  }
);

// === AUTENTICAÇÃO ===
export const loginUser = (email, senha) =>
  api.post("/auth/login", { email, senha });

export const registerUser = (dados) =>
  api.post("/auth/register", dados);

export const logoutUser = () =>
  api.post("/auth/logout");

export default api;
