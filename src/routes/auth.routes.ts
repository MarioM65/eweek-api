import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { AuthController } from '../controllers/auth/authController'


export async function authRoutes(fastify: FastifyInstance) {
  fastify.post('/login', {
    schema: {
      body: {
        type: 'object',
        required: ['credential', 'password'],
        properties: {
          credential: { type: 'string' },
          password: { type: 'string' }
        }
      }
    },
    handler: AuthController.login
  })
  fastify.post('/loginEntidade', {
    schema: {
      body: {
        type: 'object',
        required: ['credential', 'password'],
        properties: {
          credential: { type: 'string' },
          password: { type: 'string' }
        }
      }
    },
    handler: AuthController.loginEntidade
  })

  fastify.post('/logout', {
    schema: {
      headers: {
        type: 'object',
        required: ['authorization'],
        properties: {
          authorization: { type: 'string' }
        }
      }
    },
    handler: AuthController.logout
  })
  fastify.post('/logoutEntidade', {
    schema: {
      headers: {
        type: 'object',
        required: ['authorization'],
        properties: {
          authorization: { type: 'string' }
        }
      }
    },
    handler: AuthController.logoutEntidade
  })
}