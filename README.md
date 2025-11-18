# FRONTEND-FRAMEWORKS

Projeto full-stack com React no frontend e Node.js + Express no backend.

## Sobre o Projeto

Aplicação simples que demonstra a integração entre um frontend React e
um backend Express, com comunicação direta entre ambos.

## Como Usar

### Pré-requisitos

-   Node.js 14+
-   npm

### Instalação

Clone o repositório:

``` bash
git clone <url-do-repositorio>
cd FRONTEND-FRAMEWORKS
```

Instale as dependências do backend:

``` bash
npm install
```

Instale as dependências do frontend:

``` bash
cd client
npm install
cd ..
```

### Executando o Projeto

#### Modo Desenvolvimento (Frontend + Backend)

``` bash
npm run dev
```

Backend: http://localhost:5000\
Frontend: http://localhost:3000

#### Apenas Backend

``` bash
npm run server
```

#### Apenas Frontend

``` bash
npm run client
```

#### Modo Produção

``` bash
npm run build
NODE_ENV=production npm start
```

O servidor servirá a API e o build do React.

## Estrutura do Projeto

    client/                 # Frontend React
      public/
      src/
        pages/
        components/
        services/
        styles/
        assets/
      package.json
    server.js               # Servidor Express
    package.json            # Configuração do backend

## Endpoints da API

### GET /api/hello

Retorna mensagem do backend:

``` json
{
  "message": "Backend conectado com sucesso"
}
```

### GET /api/status

Retorna informações de status:

``` json
{
  "status": "Server running",
  "timestamp": "2024-11-17T23:29:00.000Z"
}
```

## Tecnologias Utilizadas

-   React
-   Express
-   CORS
-   Concurrently

## Licença

ISC
