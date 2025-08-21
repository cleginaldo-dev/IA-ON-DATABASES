import { tool } from 'ai'
import z from 'zod'
import { pg } from '../../drizzle/client'

export const postgresTool = tool({
  description: `
        Realiza uma query no PostgreSQL para buscar informações sobre as tabelas do banco de dados.

        Só pode realizar consulta (SELECT), NÃO é permitido realizar alterações (INSERT, UPDATE, DELETE).

        Tables 
        """
        CREATE TABLE subscriptions (
          id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          created_at TIMESTAMP NOT NULL DEFAULT NOW()
        );
        """

        Todas as consultas no banco devem ter um limite de 50 linhas.
        `.trim(),
  inputSchema: z.object({
    query: z.string().describe('A consulta SQL a ser executada no PostgreSQL'),
    params: z
      .array(z.any())
      .optional()
      .describe('Os parâmetros da consulta SQL'),
  }),
  execute: async ({ query, params }) => {
    console.log({ query, params })

    const result = await pg.unsafe(query, params)
    return JSON.stringify(result)
  },
})
