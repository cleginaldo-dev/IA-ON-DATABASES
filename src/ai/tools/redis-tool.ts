import { tool } from 'ai'
import z from 'zod'
import { redis } from '../../redis/client'

export const redisTool = tool({
  description: `
        Realiza um comando no Redis para buscar informações sobres o sistema de indicações como numero de cliques no link , número de indicações (convites) realizados e raking de indicações.

        Só pode ser utilizada para buscar dados do Redis, NÃO pode realizar alterações (SET, DEL, etc) nenhum comando de escrita.

        Você pode buscar dados de:

        - Um hash chamado "referral:access-count" que guarda o numero de cliques/acessos no link de convite/indicação de cada usuário no formato { "SUBSCRIBER_ID": NUMERO_DE_CLIQUES } onde o "SUBSCRIBER_ID" vem do PostgreSQL.
        - Um zset chamado "referral:ranking" que guarda o total de convites/indicações feitos por cada usuário onde o "score" é a quantidade de convites/indicações e o conteúdo é o "SUBSCRIBER_ID" que vem do PostgreSQL.
        `.trim(),
  inputSchema: z.object({
    comando: z
      .string()
      .describe(
        'O comando a ser executado no Redis como GET, HGET, ZRANGE, ZREVRANGE, etc.'
      ),
    args: z
      .array(z.string())
      .optional()
      .describe('Os argumentos que vêm logo após o comando do Redis'),
  }),
  execute: async ({ comando, args }) => {
    console.log({ comando, args })

    const result = await redis.call(comando, ...(args || []))
    return JSON.stringify(result)
  },
})
