# Relatório Final Simplificado SGEV (Ferret's Party)

## 1. Visão Geral

Sistema de gestão de eventos desenvolvido para a disciplina de
Backend-Frameworks (4º período - Uninassau Farol).\
Backend em Node.js + Express + Supabase (PostgreSQL) e frontend em
React.\
Inclui autenticação JWT, CRUD completo, arquitetura MVC e interface
visual criada por **@Rickinho3**.\
Estilos e componentes adicionais por Marcos CT, Izidio e Paulista.

## 2. Equipe

-   **Marcos Emanuel** --- Líder técnico, modelagem e integração\
-   **Pedro Izidio** --- Rotas da API\
-   **Alfred (Indiano)** --- Banco de dados e documentação\
-   **Vinicius (Paulista)** --- Middlewares e autenticação\
-   **Richard (Rickinho3)** --- Controladores e design/UI

## 3. Repositório

Frontend + Backend: https://github.com/fumiko0701/FRONTEND-FRAMEWORKS

## 4. Tecnologias

-   Node.js, Express\
-   Supabase (PostgreSQL)\
-   JWT, bcrypt\
-   React, Axios, React Router\
-   Estrutura MVC

## 5. Banco de Dados

PostgreSQL com relacionamentos e FKs.\
Arquivo SQL incluso.\
Variáveis do `.env`:\
SUPABASE_URL, SUPABASE_KEY, SUPABASE_DB_PASSWORD.

## 6. Arquitetura do Projeto

    src/
      config/
      models/
      controllers/
      routes/
      middleware/
      utils/
      server.js

## 7. Entidades Principais

Usuário, Evento, Palestra, Palestrante, Inscrição, Certificado, Local,
Categoria, Avaliação, Pagamento.

## 8. Funcionalidades

-   Login e registro com JWT\
-   Senhas criptografadas\
-   CRUD completo\
-   Integração com Supabase\
-   Interface funcional em React

## 9. Endpoints Básicos

-   POST /usuarios/registro\
-   POST /usuarios/login\
-   GET /eventos\
-   POST /eventos\
-   PUT /eventos/:id\
-   DELETE /eventos/:id

------------------------------------------------------------------------

# Informações do Projeto --- FRONTEND-FRAMEWORKS

## 1. Sobre

Aplicação full‑stack simples demonstrando comunicação entre React
(frontend) e Express (backend).

## 2. Como Usar

### Instalação

    git clone <url>
    cd FRONTEND-FRAMEWORKS
    npm install

    cd client
    npm install
    cd ..

### Execução

#### Backend + Frontend (dev)

    npm run dev

Backend: http://localhost:5000\
Frontend: http://localhost:3000

#### Só Backend

    npm run server

#### Só Frontend

    npm run client

#### Produção

    npm run build
    NODE_ENV=production npm start

## 3. Estrutura

    client/
      public/
      src/
        pages/
        components/
        services/
        styles/
        assets/
      package.json

    server.js
    package.json

## 4. Endpoints de Teste

**GET /api/hello**\
Retorna: `{ "message": "Backend conectado com sucesso" }`

**GET /api/status**\
Retorna status e timestamp.

## 5. Tecnologias

React, Express, CORS, Concurrently.
