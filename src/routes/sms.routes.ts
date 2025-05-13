import { FastifyInstance } from 'fastify'
import { enviarSMS } from '../utils/sms'

export default async function smsRoutes(fastify: FastifyInstance) {
  fastify.post('/enviar-sms', async (request, reply) => {
    const { to, message } = request.body as { to: string, message: string }

    try {
      const result = await enviarSMS(to, message)
      return { sucesso: true, result }
    } catch (err: any) {
      return reply.status(400).send({ erro: err.message })
    }
  })
}
