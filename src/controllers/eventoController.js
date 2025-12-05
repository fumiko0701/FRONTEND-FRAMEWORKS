// src/controllers/eventoController.js
// RESPONSÁVEL GERAL: Richard
// RESPONSÁVEL ATUALIZAÇÕES DE VALIDAÇÃO DE HORÁRIOS: CT
// RESPONSÁVEL GERAL: CT

import {
  Entidade,
  IDQuery,
  listarColunas,
  buscarColunaPorId,
  deletarColuna,
  validarExistenciaAtiva
} from "./genericController.js"

import { pool } from '../config/db.js'

const ent = new Entidade(
  'evento',
  'Evento',
  false,
  ['titulo', 'data_inicio', 'data_fim', 'id_local', 'id_categoria'],
  ['descricao']
)

/* ======================================================================
   NORMALIZADOR UNIFICADO
   Entrada aceita:
   - "2025-12-01T09:00"
   - "2025-12-01 09:00"
   - "2025-12-01"
   Saída:
   → "2025-12-01T09:00:00"
====================================================================== */
function normalizeDateTime(input) {
  if (!input) return null;

  let txt = String(input).trim();

  // já vem com segundos
  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(txt)) {
    return txt;
  }

  // yyyy-mm-ddThh:mm
  let match = txt.match(/^(\d{4}-\d{2}-\d{2})[ T](\d{2}:\d{2})$/);
  if (match) {
    return `${match[1]}T${match[2]}:00`;
  }

  // yyyy-mm-dd
  match = txt.match(/^(\d{4}-\d{2}-\d{2})$/);
  if (match) {
    return `${match[1]}T00:00:00`;
  }

  return null;
}

const eventoIDQuery = async (id) => IDQuery(id, ent)

/* ======================================================================
   1) LISTAR EVENTOS
====================================================================== */
export const listarEventos = async (req, res) => {
  try {
    const isAdmin = req.userTipo === "organizador";

    let query = "";

    if (isAdmin) {
      query = `
        SELECT 
          e.*,
          l.nome AS local_nome,
          l.endereco AS local_endereco,
          l.capacidade AS local_capacidade,
          e.id_categoria,
          u.id_usuario AS id_usuario_criador,
          u.nome AS criador_nome,
          u.email AS criador_email
        FROM evento e
        JOIN local l ON e.id_local = l.id_local
        JOIN usuario u ON e.id_usuario_criador = u.id_usuario
        ORDER BY e.data_inicio ASC;
      `;
    } else {
      query = `
        SELECT 
          e.*,
          l.nome AS local_nome,
          l.endereco AS local_endereco,
          l.capacidade AS local_capacidade,
          e.id_categoria,
          u.id_usuario AS id_usuario_criador,
          u.nome AS criador_nome,
          u.email AS criador_email
        FROM evento e
        JOIN local l ON e.id_local = l.id_local
        JOIN usuario u ON e.id_usuario_criador = u.id_usuario
        WHERE e.visibilidade = 'publico'
        ORDER BY e.data_inicio ASC;
      `;
    }

    const result = await pool.query(query);
    return res.json(result.rows);

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

/* ======================================================================
   2) BUSCAR POR ID
====================================================================== */
export const buscarEventoPorId = async (req, res) => {
  buscarColunaPorId(req, res, ent)
}

/* ======================================================================
   3) CRIAR EVENTO           (AGORA COM HORÁRIO REAL)
====================================================================== */
export const criarEvento = async (req, res) => {
  try {
    const userId = req.userId
    if (!userId) {
      return res.status(401).json({ erro: "Usuário não autenticado." })
    }

    const {
      titulo,
      descricao,
      data_inicio,
      data_fim,
      id_local,
      id_categoria,
      visibilidade
    } = req.body

    if (!titulo || !titulo.trim()) {
      return res.status(400).json({ erro: "Título é obrigatório." })
    }

    if (!data_inicio || !data_fim) {
      return res.status(400).json({ erro: "Datas de início e fim são obrigatórias." })
    }

    const inicioTS = normalizeDateTime(data_inicio);
    const fimTS = normalizeDateTime(data_fim);

    if (!inicioTS || !fimTS) {
      return res.status(400).json({ erro: "Datas inválidas. Envie YYYY-MM-DD HH:mm" });
    }

    const dtInicio = new Date(inicioTS);
    const dtFim = new Date(fimTS);

    if (dtFim < dtInicio) {
      return res.status(400).json({ erro: "data_fim não pode ser antes de data_inicio." })
    }

    if (!["publico", "privado"].includes(visibilidade?.toLowerCase())) {
      return res.status(400).json({ erro: "visibilidade inválida." })
    }

    if (!id_local || !id_categoria) {
      return res.status(400).json({ erro: "id_local e id_categoria são obrigatórios." })
    }

    await validarExistenciaAtiva('local', 'id_local', id_local)
    await validarExistenciaAtiva('categoria', 'id_categoria', id_categoria)

    const queryEvento = `
      INSERT INTO evento
      (titulo, descricao, data_inicio, data_fim, id_local, id_categoria, id_usuario_criador, visibilidade)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      RETURNING *;
    `

    const values = [
      titulo.trim(),
      descricao || null,
      inicioTS,
      fimTS,
      id_local,
      id_categoria,
      userId,
      visibilidade.toLowerCase()
    ]

    const result = await pool.query(queryEvento, values)
    const eventoCriado = result.rows[0]

    await pool.query(
      `INSERT INTO evento_usuario
      (id_evento, id_usuario, papel, is_criador, convite_status, data_atribuicao)
      VALUES ($1, $2, 'organizador', TRUE, 'NAO', NOW())`,
      [eventoCriado.id_evento, userId]
    );

    return res.status(201).json({
      mensagem: "Evento criado com sucesso.",
      evento: eventoCriado
    })

  } catch (err) {
    res.status(500).json({ erro: err.message })
  }
};

/* ======================================================================
   4) ATUALIZAR EVENTO
====================================================================== */
export const atualizarEvento = async (req, res) => {
  try {
    const id = req.params.id
    const userId = req.userId

    if (!userId) return res.status(401).json({ erro: "Usuário não autenticado." })

    const evento = await eventoIDQuery(id)
    if (!evento) return res.status(404).json({ erro: "Evento não encontrado." })

    const {
      titulo,
      descricao,
      data_inicio,
      data_fim,
      id_local,
      id_categoria,
      visibilidade
    } = req.body

    const inicioTS = data_inicio ? normalizeDateTime(data_inicio) : evento.data_inicio;
    const fimTS = data_fim ? normalizeDateTime(data_fim) : evento.data_fim;

    const dtInicio = new Date(inicioTS);
    const dtFim = new Date(fimTS);

    if (dtFim < dtInicio) {
      return res.status(400).json({ erro: "data_fim não pode ser antes de data_inicio." })
    }

    if (visibilidade && !["publico", "privado"].includes(visibilidade.toLowerCase())) {
      return res.status(400).json({ erro: "visibilidade inválida." })
    }

    if (id_local !== undefined) await validarExistenciaAtiva('local', 'id_local', id_local)
    if (id_categoria !== undefined) await validarExistenciaAtiva('categoria', 'id_categoria', id_categoria)

    const mapping = {
      titulo,
      descricao,
      data_inicio: inicioTS,
      data_fim: fimTS,
      id_local,
      id_categoria,
      visibilidade
    }

    const campos = []
    const valores = []
    let idx = 1

    for (const key in mapping) {
      if (mapping[key] !== undefined) {
        campos.push(`${key} = $${idx}`)
        valores.push(mapping[key])
        idx++
      }
    }

    if (campos.length === 0) {
      return res.status(400).json({ erro: "Nenhum dado enviado para atualização." })
    }

    valores.push(id)

    const query = `
      UPDATE evento SET ${campos.join(', ')}
      WHERE id_evento = $${idx}
      RETURNING *
    `;

    const result = await pool.query(query, valores)

    return res.json({
      mensagem: "Evento atualizado com sucesso!",
      evento: result.rows[0]
    })

  } catch (err) {
    res.status(500).json({ erro: "Erro interno ao atualizar evento.", detalhes: err.message })
  }
}

/* ======================================================================
   5) EXCLUIR EVENTO
====================================================================== */
export const excluirEvento = async (req, res) => {
  deletarColuna(req, res, ent)
}

/* ======================================================================
   6) MEU PAPEL NO EVENTO
====================================================================== */
export const verMeuPapelNoEvento = async (req, res) => {
  try {
    const userId = req.userId;
    const { id_evento } = req.params;

    if (!userId) {
      return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    const result = await pool.query(
      `SELECT papel, is_criador, convite_status, data_atribuicao
       FROM evento_usuario
       WHERE id_evento = $1 AND id_usuario = $2`,
      [id_evento, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ mensagem: "Você não possui papel neste evento." });
    }

    return res.status(200).json({
      id_evento,
      id_usuario: userId,
      ...result.rows[0]
    });

  } catch (err) {
    res.status(500).json({ erro: err.message });
  }
};

/* ======================================================================
   7) EVENTOS ATIVOS DO USUÁRIO (AGORA USANDO TIMESTAMP)
====================================================================== */
export const buscarEventosAtivosDoUsuario = async (req, res) => {
  
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    const dataFiltroRaw = req.body?.data || req.query?.data;

    if (!dataFiltroRaw) {
      return res.status(400).json({ erro: "Envie { data: 'YYYY-MM-DD HH:mm' }" });
    }

    const dataFiltroTS = normalizeDateTime(dataFiltroRaw);

    if (!dataFiltroTS) {
      return res.status(400).json({ erro: "Formato de data inválido." });
    }

    const result = await pool.query(
      `
      SELECT 
        e.*,
        eu.papel,
        eu.is_criador,
        eu.convite_status,
        l.nome AS local_nome,
        l.endereco AS local_endereco,
        l.capacidade AS local_capacidade,
        c.nome AS categoria_nome
      FROM evento_usuario eu
      JOIN evento e ON eu.id_evento = e.id_evento
      JOIN local l ON l.id_local = e.id_local
      JOIN categoria c ON c.id_categoria = e.id_categoria
      WHERE eu.id_usuario = $1
        AND eu.visibilidade = 'ativo'
        AND e.visibilidade IN ('publico', 'privado')
        AND e.status_interno = 'normal'
        AND e.data_inicio <= $2::timestamp
        AND e.data_fim >= $2::timestamp
      ORDER BY e.data_inicio ASC;
      `,
      [userId, dataFiltroTS]
    );

    return res.json({
      total: result.rowCount,
      eventos_ativos: result.rows
    });

  } catch (err) {
    console.error("Erro ao buscar eventos ativos:", err);
    res.status(500).json({ erro: err.message });
  }
};

/* ======================================================================
   8) TODOS EVENTOS DO USUÁRIO
====================================================================== */
export const buscarTodosEventosDoUsuario = async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ erro: "Usuário não autenticado." });
    }

    const result = await pool.query(
      `
      SELECT 
        e.*,
        eu.papel,
        eu.is_criador,
        eu.convite_status,
        l.nome AS local_nome,
        l.endereco AS local_endereco,
        l.capacidade AS local_capacidade,
        c.nome AS categoria_nome
      FROM evento_usuario eu
      JOIN evento e ON eu.id_evento = e.id_evento
      JOIN local l ON l.id_local = e.id_local
      JOIN categoria c ON c.id_categoria = e.id_categoria
      WHERE eu.id_usuario = $1
        AND eu.visibilidade = 'ativo'
        AND e.visibilidade IN ('publico', 'privado')
        AND e.status_interno = 'normal'
      ORDER BY e.data_inicio DESC;
      `,
      [userId]
    );

    return res.json({
      total: result.rowCount,
      eventos: result.rows
    });

  } catch (err) {
    console.error("Erro ao buscar eventos do usuário:", err);
    res.status(500).json({ erro: err.message });
  }
};
