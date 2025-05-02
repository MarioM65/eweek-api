import { FastifyReply, FastifyRequest } from 'fastify'
import prisma from './plugins/prisma'

export const authenticateToken = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
  
      const token = request.headers.authorization?.split(' ')[1]
      if (!token) {
        throw new Error('Token not provided')
      }
  
      // Verificar se o token está válido na base de dados
      const userToken = await prisma.userToken.findFirst({
        where: {
          token,
          revoked: false,
          expiresAt: {
            gt: new Date()
          }
        }
      })
  
      if (!userToken) {
        return reply.code(401).send({
          success: false,
          message: 'Token is invalid or expired'
        })
      }
  
      // Atualizar último uso do token
      await prisma.userToken.update({
        where: { id: userToken.id },
        data: { lastUsed: new Date() }
      })
  
    } catch (err) {
      return reply.code(401).send({
        success: false,
        message: 'Unauthorized access'
      })
    }
  }