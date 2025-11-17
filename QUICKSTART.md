# Guia Rápido de Uso

## 🚀 Início Rápido

### Instalação (Primeira vez)
```bash
# 1. Clonar o repositório
git clone <url-do-repositorio>
cd FRONTEND-FRAMEWORKS

# 2. Instalar dependências do backend
npm install

# 3. Instalar dependências do frontend
cd client
npm install
cd ..
```

### Executar o Projeto

#### Desenvolvimento (Recomendado)
```bash
npm run dev
```
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

#### Apenas Backend
```bash
npm run server
```

#### Apenas Frontend
```bash
npm run client
```

#### Produção
```bash
# Build do frontend
npm run build

# Executar em modo produção
NODE_ENV=production npm start
```

## 📝 Como Adicionar seu Backend Existente

1. Copie suas rotas e lógica de negócio para `server.js` ou crie novos arquivos
2. Adicione suas dependências ao `package.json`
3. Configure suas variáveis de ambiente (crie um arquivo `.env`)
4. Atualize as chamadas de API no frontend React (`client/src/App.js`)

Exemplo de nova rota:
```javascript
// Em server.js
app.get('/api/meus-dados', (req, res) => {
  // Sua lógica aqui
  res.json({ dados: 'seus dados' });
});
```

## 📁 Estrutura do Projeto

```
FRONTEND-FRAMEWORKS/
├── server.js              # Servidor Express (Backend)
├── package.json           # Dependências do backend
├── client/                # Aplicação React (Frontend)
│   ├── src/
│   │   ├── App.js        # Componente principal
│   │   └── App.css       # Estilos
│   └── package.json      # Dependências do frontend
└── README.md             # Documentação completa
```

## 🔌 API Endpoints Disponíveis

- `GET /api/hello` - Mensagem de saudação
- `GET /api/status` - Status do servidor

## 💡 Dicas

1. Use `npm run dev` durante o desenvolvimento para ver mudanças em tempo real
2. O proxy está configurado para redirecionar `/api/*` do frontend (porta 3000) para o backend (porta 5000)
3. Modifique `client/src/App.js` para personalizar o frontend
4. Adicione suas rotas em `server.js` para personalizar o backend

## 🆘 Problemas Comuns

### Porta já em uso
Se a porta 3000 ou 5000 já estiver em uso, você pode:
- Matar o processo usando a porta: `lsof -ti:3000 | xargs kill` (Mac/Linux)
- Ou mudar a porta no código

### Erro ao conectar com o backend
- Verifique se o servidor backend está rodando
- Confirme que o proxy está configurado em `client/package.json`

## 📚 Mais Informações

Veja o [README.md](README.md) para documentação completa.
