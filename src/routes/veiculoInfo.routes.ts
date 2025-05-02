import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { VeiculoInfoController } from '../controllers/veiculoInfoController'

export async function VeiculoInfoRoutes(fastify: FastifyInstance) {
  // Criar uma nova VeiculoInfo
  fastify.post('/veiculoInfos', {
    schema: {
      body: {
        type: 'object',
        required: [
          'vc_matricula', 'modelo', 'itemId',
          'userId', 'seguroId'
        ],
        properties: {
          vc_matricula: { type: 'string', minLength: 2 },
          modelo: { type: 'string', minLength: 2 },
          itemId: { type: 'number' },
          userId: { type: 'number' },
          seguroId: { type: 'number' }
        }
      }
    },
    handler: VeiculoInfoController.create
  });

  // Listar todas as VeiculoInfos
  fastify.get('/veiculoInfos', {
    onRequest: [authenticateToken],
    handler: VeiculoInfoController.index
  });

  // Buscar VeiculoInfo pelo ID
  fastify.get<{ Params: { id: string } }>('/veiculoInfos/:id', {
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
    handler: VeiculoInfoController.show
  });

  // Atualizar VeiculoInfo pelo ID
  fastify.put<{ Params: { id: string }; Body: any }>('/veiculoInfos/:id', {
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
          vc_matricula: { type: 'string', minLength: 2 },
          modelo: { type: 'string', minLength: 2 },
          itemId: { type: 'number' },
          userId: { type: 'number' },
          seguroId: { type: 'number' }
        }
      }
    },
    handler: VeiculoInfoController.update
  });

  // Deletar VeiculoInfo pelo ID
  fastify.delete<{ Params: { id: string } }>('/veiculoInfos/:id', {
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
    handler: VeiculoInfoController.delete
  });

  // Restaurar VeiculoInfo
  fastify.put<{ Params: { id: string } }>('/veiculoInfos/restore/:id', {
    onRequest: [authenticateToken],
    handler: VeiculoInfoController.restore
  });

  // Excluir VeiculoInfo permanentemente
  fastify.delete<{ Params: { id: string } }>('/veiculoInfos/purge/:id', {
    onRequest: [authenticateToken],
    handler: VeiculoInfoController.purge
  });

  // Listar VeiculoInfos na lixeira
  fastify.get('/veiculoInfos/trash', {
    onRequest: [authenticateToken],
    handler: VeiculoInfoController.trash
  });
}
