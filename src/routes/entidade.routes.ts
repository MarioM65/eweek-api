import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { EntidadeController } from '../controllers/entidadeController'

export async function entidadeRoutes(fastify: FastifyInstance) {
  // Criar uma nova entidade
  fastify.post('/entidades', {
    schema: {
      body: {
        type: 'object',
        required: [
          'vc_email', 'password', 'vc_telefone', 'filialId'
        ],
        properties: {
          vc_email: { type: 'string', minLength: 2 },
          password: { type: 'string' },
          vc_telefone: { type: 'string' },
          filialId: { type: 'number' },
        }
      }
    },
    handler: EntidadeController.create
  });

  // Listar todas as entidades
  fastify.get('/entidades', {
    onRequest: [authenticateToken],
    handler: EntidadeController.index
  });

  // Buscar entidade pelo ID
  fastify.get<{ Params: { id: string } }>('/entidades/:id', {
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
    handler: EntidadeController.show
  });

  // Atualizar entidade pelo ID
  fastify.put<{ Params: { id: string }; Body: any }>('/entidades/:id', {
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
          vc_email: { type: 'string', minLength: 2 },
          password: { type: 'string' },
          vc_telefone: { type: 'string' },
          filialId: { type: 'number' },
        }
      }
    },
    handler: EntidadeController.update
  });

  // Deletar entidade pelo ID
  fastify.delete<{ Params: { id: string } }>('/entidades/:id', {
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
    handler: EntidadeController.delete
  });

  // Restaurar entidade
  fastify.put<{ Params: { id: string } }>('/entidades/restore/:id', {
    onRequest: [authenticateToken],
    handler: EntidadeController.restore
  });

  // Excluir entidade permanentemente
  fastify.delete<{ Params: { id: string } }>('/entidades/purge/:id', {
    onRequest: [authenticateToken],
    handler: EntidadeController.purge
  });

  // Listar entidades na lixeira
  fastify.get('/entidades/trash', {
    onRequest: [authenticateToken],
    handler: EntidadeController.trash
  });
}
