// server.js (arquivo raiz do projeto)
// responsável por rodar o backend e também servir o frontend em produção

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// importando todas as rotas do backend
import categoriasRoutes from './src/routes/categoriasRoutes.js';
import eventosRoutes from './src/routes/eventosRoutes.js';
import inscricoesRoutes from './src/routes/inscricoesRoutes.js';
import locaisRoutes from './src/routes/locaisRoutes.js';
import pagamentosRoutes from './src/routes/pagamentosRoutes.js';
import palestrasRoutes from './src/routes/palestrasRoutes.js';
import usuarioRoutes from './src/routes/usuarioRoutes.js';
import loginRoutes from './src/routes/loginRoutes.js';

// inicializa o pool do banco
import './src/config/db.js';

// ajuste necessário para usar __dirname em ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// middlewares básicos do servidor
app.use(cors());
app.use(express.json());

// =====================================
// rotas principais do backend
// =====================================

app.use('/categorias', categoriasRoutes);
app.use('/eventos', eventosRoutes);
app.use('/inscricoes', inscricoesRoutes);
app.use('/locais', locaisRoutes);
app.use('/pagamentos', pagamentosRoutes);
app.use('/palestras', palestrasRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/auth', loginRoutes);

// rota simples usada pelo frontend pra testar conexão
app.get('/api/hello', (req, res) => {
  res.json({ message: "Backend conectado com sucesso" });
});

// rota simples de status do servidor
app.get('/api/status', (req, res) => {
  res.json({
    status: 'Server running',
    timestamp: new Date().toISOString()
  });
});

// =====================================
// serve o frontend (React) quando estiver em produção
// =====================================

const clientBuildPath = path.join(__dirname, 'client', 'build');

// se estiver no modo de produção, o backend entrega os arquivos do React
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientBuildPath));

  // qualquer rota não definida cai no index.html do React
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// =====================================
// inicia o servidor
// =====================================

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || 'localhost';

app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});

