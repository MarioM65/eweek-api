import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { ItemInfoController } from '../controllers/itemInfoController';

export async function itemInfoRoutes(fastify: FastifyInstance) {
  // Criar uma novaItemInfo
  fastify.post('/itemInfos', {
    schema: {
      body: {
        type: 'object',
        required: [
          'vc_nome', 'txt_descricao', 'itemId',
          'userId', 'seguroId'
        ],
        properties: {
          vc_nome: { type: 'string', minLength: 2 },
          txt_descricao: { type: 'string', minLength: 2 },
          itemId: { type: 'number' },
          userId: { type: 'number' },
          seguroId: { type: 'number' }
        }
      }
    },
    handler:ItemInfoController.create
  });

  // Listar todas asItemInfos
  fastify.get('/itemInfos', {
    handler:ItemInfoController.index
  });

  // BuscarItemInfo pelo ID
  fastify.get<{ Params: { id: string } }>('/itemInfos/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    handler:ItemInfoController.show
  });

  // AtualizarItemInfo pelo ID
  fastify.put<{ Params: { id: string }; Body: any }>('/itemInfos/:id', {
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
          vc_nome: { type: 'string', minLength: 2 },
          txt_descricao: { type: 'string', minLength: 2 },
          itemId: { type: 'number' },
          userId: { type: 'number' },
          seguroId: { type: 'number' }
        }
      }
    },
    handler:ItemInfoController.update
  });

  // DeletarItemInfo pelo ID
  fastify.delete<{ Params: { id: string } }>('/itemInfos/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    handler:ItemInfoController.delete
  });

  // RestaurarItemInfo
  fastify.put<{ Params: { id: string } }>('/itemInfos/restore/:id', {
    handler:ItemInfoController.restore
  });

  // ExcluirItemInfo permanentemente
  fastify.delete<{ Params: { id: string } }>('/itemInfos/purge/:id', {
    handler:ItemInfoController.purge
  });

  // ListarItemInfos na lixeira
  fastify.get('/itemInfos/trash', {
    handler:ItemInfoController.trash
  });
}
