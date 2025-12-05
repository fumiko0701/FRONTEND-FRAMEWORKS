// server.js (arquivo raiz do projeto)
// Servidor principal: Backend + entrega do React em produção

import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Rotas do backend
import categoriasRoutes from "./src/routes/categoriasRoutes.js";
import eventosRoutes from "./src/routes/eventosRoutes.js";
import inscricoesRoutes from "./src/routes/inscricoesRoutes.js";
import locaisRoutes from "./src/routes/locaisRoutes.js";
import pagamentosRoutes from "./src/routes/pagamentosRoutes.js";
import palestrasRoutes from "./src/routes/palestrasRoutes.js";
import usuarioRoutes from "./src/routes/usuarioRoutes.js";
import loginRoutes from "./src/routes/loginRoutes.js";
import convitesRoutes from "./src/routes/convitesRoutes.js";
import assetsRoutes from "./src/routes/assetsRoutes.js";

// Inicializa conexão com DB
import "./src/config/db.js";

dotenv.config();

// Fix para __dirname em ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- MIDDLEWARES ---
app.use(cors());
app.use(express.json());

// ==============================
// 🔥 SERVE ARQUIVOS DA PASTA /src/assets
// ==============================
const assetsPath = path.join(__dirname, "src", "assets");
app.use("/assets", express.static(assetsPath));

// ==============================
// 🔥 ROTAS DO BACKEND
// ==============================
app.use("/categorias", categoriasRoutes);
app.use("/eventos", eventosRoutes);
app.use("/inscricoes", inscricoesRoutes);
app.use("/locais", locaisRoutes);
app.use("/pagamentos", pagamentosRoutes);
app.use("/palestras", palestrasRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/auth", loginRoutes);
app.use("/convites", convitesRoutes);
app.use("/assets", assetsRoutes);

// Rotas de teste
app.get("/api/hello", (req, res) => {
  res.json({ message: "Backend conectado com sucesso" });
});

app.get("/api/status", (req, res) => {
  res.json({
    status: "Server running",
    timestamp: new Date().toISOString(),
  });
});

// ==============================
// 🔥 FRONTEND EM PRODUÇÃO
// ==============================
const clientBuildPath = path.join(__dirname, "client", "build");

if (process.env.NODE_ENV === "production") {
  app.use(express.static(clientBuildPath));

  app.get("*", (req, res) => {
    res.sendFile(path.join(clientBuildPath, "index.html"));
  });
}

// ==============================
// 🔥 INICIA SERVIDOR
// ==============================
const PORT = process.env.PORT_BACKEND || 3005;
const HOST = process.env.HOST_BACKEND || "localhost";

app.listen(PORT, () => {});
