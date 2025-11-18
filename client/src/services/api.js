import axios from "axios";

// TOKEN TEMPORÁRIO FIXO (para testes)
const TOKEN_TESTE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZF91c3VhcmlvIjoxMiwiZW1haWwiOiJ3YWxsc2NvdmVyZWRpbmJsb29kQGFsdGVyLm55YSIsInRpcG8iOiJvcmdhbml6YWRvciIsImlhdCI6MTc2MzQyOTYwMCwiZXhwIjoxNzYzNDM2ODAwfQ.vDjwU021PdvN_r5ITdeFGDDuS7Ln9GSN7vy4YKzYqto";

const api = axios.create({
  baseURL: "http://localhost:3001",
});

// Sempre envia o TOKEN_TESTE no Authorization
api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${TOKEN_TESTE}`;
  return config;
});

export default api;
