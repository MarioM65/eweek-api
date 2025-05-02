import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { ParentescoController } from '../controllers/parentescoController'

export async function parentescoRoutes(fastify: FastifyInstance) {
  // Criar um novo parentesco
  fastify.post('/parentescos', {
    schema: {
      body: {
        type: 'object',
        required: ['parentesco', 'user1Id', 'user2Id'],
        properties: {
          parentesco: { type: 'string', minLength: 2 },
          user1Id: { type: 'number' },
          user2Id: { type: 'number' }
        }
      }
    },
    handler: ParentescoController.create
  });

  // Listar todos os parentescos
  fastify.get('/parentescos', {
    onRequest: [authenticateToken],
    handler: ParentescoController.index
  });

  // Buscar parentesco pelo ID
  fastify.get<{ Params: { id: string } }>('/parentescos/:id', {
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
    handler: ParentescoController.show
  });

  // Atualizar parentesco pelo ID
  fastify.put<{ Params: { id: string }; Body: any }>('/parentescos/:id', {
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
          parentesco: { type: 'string', minLength: 2 },
          user1Id: { type: 'number' },
          user2Id: { type: 'number' }
        }
      }
    },
    handler: ParentescoController.update
  });

  // Deletar parentesco pelo ID
  fastify.delete<{ Params: { id: string } }>('/parentescos/:id', {
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
    handler: ParentescoController.delete
  });

  // Restaurar parentesco
  fastify.put<{ Params: { id: string } }>('/parentescos/restore/:id', {
    onRequest: [authenticateToken],
    handler: ParentescoController.restore
  });

  // Excluir parentesco permanentemente
  fastify.delete<{ Params: { id: string } }>('/parentescos/purge/:id', {
    onRequest: [authenticateToken],
    handler: ParentescoController.purge
  });

  // Listar parentescos na lixeira
  fastify.get('/parentescos/trash', {
    onRequest: [authenticateToken],
    handler: ParentescoController.trash
  });
}
