import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { UserController } from '../controllers/userController'

export async function userRoutes(fastify: FastifyInstance) {
  // Criar um novo usuário
  fastify.post('/users', {
    schema: {
      body: {
        type: 'object',
        required: ['vc_pnome', 'vc_mnome', 'vc_unome', 'vc_telefone', 'vc_bi', 'password', 'vc_email'],
        properties: {
          vc_pnome: { type: 'string', minLength: 2 },
          vc_mnome: { type: 'string', minLength: 2 },
          vc_unome: { type: 'string', minLength: 2 },
          vc_email: { type: 'string', format: 'email' },
          vc_telefone: { type: 'string', minLength: 9 },
          vc_bi: { type: 'string', minLength: 10, maxLength: 14 },
          password: { type: 'string', minLength: 6 },
          img_perfil: { type: 'string' },  // Se quiser permitir imagem de perfil
        }
      }
    },
    handler: UserController.create
  });

  // Listar todos os usuários (rota protegida)
  fastify.get('/users', {
    onRequest: [authenticateToken],
    handler: UserController.index
  });

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
  });
  fastify.get<{ Params: { id: string } }>('/users/eu/:id', {
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
    handler: UserController.meus_dados
  });

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
          vc_pnome: { type: 'string', minLength: 2 },
          vc_mnome: { type: 'string', minLength: 2 },
          vc_unome: { type: 'string', minLength: 2 },
          vc_email: { type: 'string', format: 'email' },
          vc_telefone: { type: 'string', minLength: 9 },
          vc_bi: { type: 'string', minLength: 10, maxLength: 14 },
          password: { type: 'string', minLength: 6 },
          img_perfil: { type: 'string' },
        }
      }
    },
    handler: UserController.update
  });

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
  });

  // Verificar se o email já existe
  fastify.get<{ Querystring: { vc_email: string } }>('/users/checkemail', {
    schema: {
      querystring: {
        type: 'object',
        required: ['vc_email'],
        properties: {
          vc_email: { type: 'string', format: 'email' }
        }
      }
    },
    handler: UserController.checkEmail
  });

  // Restaurar usuário
  fastify.put<{ Params: { id: string } }>('/users/restore/:id', {
    onRequest: [authenticateToken],
    handler: UserController.restore
  });

  // Excluir usuário permanentemente
  fastify.delete<{ Params: { id: string } }>('/users/purge/:id', {
    onRequest: [authenticateToken],
    handler: UserController.purge
  });

  // Listar usuários na lixeira (soft delete)
  fastify.get('/users/trash', {
    onRequest: [authenticateToken],
    handler: UserController.trash
  });
}
