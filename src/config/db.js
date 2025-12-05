// src/config/db.js
// RESPONSÁVEL: CT — versão com mensagens amigáveis e reconexão

import pkg from "pg"
import dotenv from "dotenv"
dotenv.config()

const { Pool } = pkg

const MAX_RETRIES = 5
const RETRY_DELAY = 5000

let pool = null

function logAmigavel(msg) {
  // logs silenciados por solicitação do projeto
}

function logOk(msg) {
  // logs silenciados por solicitação do projeto
}

function logErro(msg) {
  // logs silenciados por solicitação do projeto
}

function createPool() {
  if (!pool) {
    pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000
    })

    // *** trata erros do pool ***
    pool.on("error", async (err) => {
      const erroMsg = err?.message?.toLowerCase() || ""

      // erros comuns de falta de internet
      const errosOffline = [
        "timeout",
        "connection terminated",
        "server closed the connection",
        "connection ended unexpectedly",
        "getaddrinfo",
        "connect econnrefused"
      ]

      if (errosOffline.some(e => erroMsg.includes(e))) {
        logAmigavel("Banco desconectado (sinal fraco / offline).")
        logAmigavel("Tentando reconectar...")
        await reconnectPool()
        return
      }

      // erros que o Supabase Pooler causa naturalmente
      const errosNormaisPooler = [
        "57P01",
        "client_termination",
        "ECONNRESET",
        ":shutdown",
        ":db_termination"
      ]

      if (
        err.code && errosNormaisPooler.includes(err.code) ||
        errosNormaisPooler.some(e => erroMsg.includes(e))
      ) {
        logAmigavel("Conexão finalizada pelo pooler. Reconectando...")
        await reconnectPool()
        return
      }

      // só loga erros realmente inesperados
      logErro("Erro inesperado no pool: " + err.message)
    })
  }

  return pool
}

async function reconnectPool(retry = 0) {
  try {
    if (pool) await pool.end()
    pool = null

    createPool()

    const client = await pool.connect()
    client.release()

    logOk("Reconectado ao banco de dados!")
  } catch (err) {
    logErro(`Erro ao reconectar (${retry + 1}/${MAX_RETRIES}): ${err.message}`)

    if (retry < MAX_RETRIES) {
      setTimeout(() => reconnectPool(retry + 1), RETRY_DELAY)
    } else {
      logErro("Falha total ao reconectar. Encerrando servidor.")
      process.exit(1)
    }
  }
}

// inicia a pool
createPool()

export { pool }
