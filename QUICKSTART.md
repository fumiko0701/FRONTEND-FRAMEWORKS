# Guia Rápido de Uso

## Início Rápido

### Instalação (primeira vez)
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

### Executar o projeto

#### Desenvolvimento (recomendado)
```bash
npm run dev
```
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

#### Apenas backend
```bash
npm run server
```

#### Apenas frontend
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

## Como adicionar seu backend existente

1. Copie rotas e lógica para `server.js` ou crie novos arquivos.
2. Adicione dependências em `package.json`.
3. Configure variáveis de ambiente (`.env`).
4. Atualize chamadas de API no frontend (`client/src/App.js`).

Exemplo de rota:
```javascript
// Em server.js
app.get('/api/meus-dados', (req, res) => {
  res.json({ dados: 'seus dados' });
});
```

## Estrutura do projeto

```
FRONTEND-FRAMEWORKS/
├── server.js
├── package.json
├── client/
│   ├── src/
│   │   ├── App.js
│   │   └── App.css
│   └── package.json
└── README.md
```

## API disponíveis

- GET /api/hello — Mensagem de saudação
- GET /api/status — Status do servidor

## Dicas rápidas

- Use `npm run dev` para desenvolvimento com reload.
- Proxy: `/api/*` do frontend (3000) redireciona para backend (5000).
- Edite `client/src/App.js` para personalizar o frontend.
- Adicione rotas em `server.js` para o backend.

## Problemas comuns

Porta já em uso:
- Matar processo (Mac/Linux): `lsof -ti:3000 | xargs kill`
- Ou alterar a porta no código.

Erro ao conectar com o backend:
- Verifique se o backend está em execução.
- Confirme o proxy em `client/package.json`.

## Mais informações

Consulte o README.md para a documentação completa.
