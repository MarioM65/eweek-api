import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { ItemController } from '../controllers/itemController'

export async function itemRoutes(fastify: FastifyInstance) {
  // Criar uma nova Item
  fastify.post('/items', {
    schema: {
      body: {
        type: 'object',
        required: ['vc_nome', 'tipo_item', 'txt_descricao'],
        properties: {
          vc_nome: { type: 'string', minLength: 2 },
          tipo_item: { type: 'string' },
          txt_descricao: { type: 'string' }
        }
      }
    },
    handler: ItemController.create
  });

  // Listar todas as Items
  fastify.get('/items', {
    handler: ItemController.index
  });

  // Buscar Item pelo ID
  fastify.get<{ Params: { id: string } }>('/items/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    handler: ItemController.show
  });

  // Atualizar Item pelo ID
  fastify.put<{ Params: { id: string }; Body: any }>('/items/:id', {
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
          tipo_item: { type: 'string' },
          txt_descricao: { type: 'string' }
        }
      }
    },
    handler: ItemController.update
  });

  // Deletar Item pelo ID
  fastify.delete<{ Params: { id: string } }>('/items/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    handler: ItemController.delete
  });

  // Restaurar Item
  fastify.put<{ Params: { id: string } }>('/items/restore/:id', {
    handler: ItemController.restore
  });

  // Excluir Item permanentemente
  fastify.delete<{ Params: { id: string } }>('/items/purge/:id', {
    handler: ItemController.purge
  });

  // Listar Items na lixeira
  fastify.get('/items/trash', {
    handler: ItemController.trash
  });
}
