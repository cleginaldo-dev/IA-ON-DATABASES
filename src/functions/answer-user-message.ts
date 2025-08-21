import { generateText, stepCountIs } from 'ai'
import { openai } from '../ai/openai'
import { postgresTool } from '../ai/tools/postgres-tool'
import { redisTool } from '../ai/tools/redis-tool'

interface AnswerUserMessageParams {
  message: string
}

export async function answerUserMessage({ message }: AnswerUserMessageParams) {
  const answer = await generateText({
    model: openai,
    prompt: message,
    tools: {
      postgresTool,
      redisTool,
    },
    system:
      `Você é um assistente  de I.A. que ajuda os usuários a encontrar informações de um ou mais bancos de dados

      Inclua na resposta somente o que o usuário pediu, sem nenhum texto adicional.

      O retorno deve ser em markdown (sem incluir \`\`\` no inicio ou no fim).
      `.trim(),
    stopWhen: stepCountIs(5), // stop after 5 steps if tools were called
  })

  return { response: answer.text }
}
