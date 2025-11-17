# FRONTEND-FRAMEWORKS

Um projeto full-stack simples com React + Node.js + Express

## 📋 Sobre o Projeto

Este é um projeto básico pronto para uso que combina:
- **Frontend**: React
- **Backend**: Node.js + Express
- **Exemplo**: Hello World simples com comunicação entre frontend e backend

## 🚀 Como Usar

### Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (vem com Node.js)

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd FRONTEND-FRAMEWORKS
```

2. Instale as dependências do backend:
```bash
npm install
```

3. Instale as dependências do frontend:
```bash
cd client
npm install
cd ..
```

### Executando o Projeto

#### Modo Desenvolvimento (Frontend + Backend juntos)

Execute ambos os servidores simultaneamente:
```bash
npm run dev
```

Isso iniciará:
- Backend (Express) na porta 5000: http://localhost:5000
- Frontend (React) na porta 3000: http://localhost:3000

#### Apenas Backend

```bash
npm run server
```

#### Apenas Frontend

```bash
npm run client
```

#### Modo Produção

1. Build do frontend:
```bash
npm run build
```

2. Inicie o servidor:
```bash
NODE_ENV=production npm start
```

O servidor servirá tanto a API quanto os arquivos estáticos do React em http://localhost:5000

## 📁 Estrutura do Projeto

```
FRONTEND-FRAMEWORKS/
├── client/                 # Aplicação React
│   ├── public/            # Arquivos públicos
│   ├── src/               # Código fonte React
│   │   ├── App.js        # Componente principal
│   │   ├── App.css       # Estilos
│   │   └── ...
│   └── package.json      # Dependências do frontend
├── server.js             # Servidor Express
├── package.json          # Dependências do backend
└── README.md            # Este arquivo
```

## 🔌 API Endpoints

### GET /api/hello
Retorna uma mensagem de saudação do backend
```json
{
  "message": "Hello World from Express Backend!"
}
```

### GET /api/status
Retorna o status do servidor
```json
{
  "status": "Server is running",
  "timestamp": "2024-11-17T23:29:00.000Z"
}
```

## 🔧 Personalizando

### Adicionando seu Backend Existente

Para integrar seu backend Node.js + Express existente:

1. Copie suas rotas e lógica para o arquivo `server.js` ou crie novos arquivos de rotas
2. Adicione suas dependências ao `package.json` principal
3. Configure suas variáveis de ambiente conforme necessário

Exemplo de como adicionar novas rotas:

```javascript
// Em server.js
app.get('/api/sua-rota', (req, res) => {
  res.json({ data: 'seus dados' });
});
```

### Modificando o Frontend

O código React está em `client/src/App.js`. Modifique conforme necessário para sua aplicação.

## 📦 Tecnologias Utilizadas

- **React** 19.2.0 - Biblioteca JavaScript para interfaces
- **Express** 5.1.0 - Framework web para Node.js
- **CORS** - Middleware para habilitar CORS
- **Concurrently** - Para executar múltiplos comandos simultaneamente

## 📝 Licença

ISC

## 🤝 Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request
