import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { UserController } from '../controllers/userController'

export async function userRoutes(fastify: FastifyInstance) {
  // Criar um novo usuário
  fastify.post('/users', {
    schema: {
      body: {
        type: 'object',
        required: ['firstName', 'lastName', 'username', 'phone', 'bi', 'password', 'profileId', 'statusId',"address", "exp","description", "profession"],
        properties: {
          firstName: { type: 'string', minLength: 2 },
          lastName: { type: 'string', minLength: 2 },
          username: { type: 'string', minLength: 3 },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string', minLength: 9 },
          bi: { type: 'string', minLength: 14, maxLength: 14 },
          password: { type: 'string', minLength: 6 },
          profileId: { type: 'integer' },
          statusId: { type: 'integer' },
          address: {type:"string"}, // Adicionar essa linha
          exp:{type:"integer"},
          description: {type:"string"},
          profession: {type:"string"},
        }
      }
    },
    handler: UserController.create
  })

  // Listar todos os usuários (rota protegida)
  fastify.get('/users', {
    onRequest: [authenticateToken],
    handler: UserController.index
  })

  // Buscar usuário pelo ID
  fastify.get<{ Params: { id: string } }>('/users/:id', {
    onRequest: [authenticateToken],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    handler: UserController.show
  })

  // Atualizar usuário pelo ID
  fastify.put<{ Params: { id: string }; Body: any }>('/users/:id', {
    onRequest: [authenticateToken],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      },
      body: {
        type: 'object',
        properties: {
          firstName: { type: 'string', minLength: 2 },
          lastName: { type: 'string', minLength: 2 },
          username: { type: 'string', minLength: 3 },
          email: { type: 'string', format: 'email' },
          phone: { type: 'string', minLength: 9 },
          bi: { type: 'string', minLength: 14, maxLength: 14 },
          password: { type: 'string', minLength: 6 },
          profileId: { type: 'integer' },
          statusId: { type: 'integer' }
        }
      }
    },
    handler: UserController.update
  })

  // Deletar usuário pelo ID
  fastify.delete<{ Params: { id: string } }>('/users/:id', {
    onRequest: [authenticateToken],
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    handler: UserController.delete
  })
  // Verificar se o username já existe
fastify.get<{ Querystring: { username: string } }>('/users/checkusername', {
  schema: {
    querystring: {
      type: 'object',
      required: ['username'],
      properties: {
        username: { type: 'string', minLength: 3 }
      }
    }
  },
  handler: UserController.checkUsername
});

// Verificar se o email já existe
fastify.get<{ Querystring: { email: string } }>('/users/checkemail', {
  schema: {
    querystring: {
      type: 'object',
      required: ['email'],
      properties: {
        email: { type: 'string', format: 'email' }
      }
    }
  },
  handler: UserController.checkEmail
});

}
