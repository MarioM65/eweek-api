import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { ItemServicoController } from '../controllers/itemServicoController'

export async function itemServicoRoutes(fastify: FastifyInstance) {
  // Criar uma nova relação entre usuário e servico
  fastify.post('/itemServicos', {
    schema: {
      body: {
        type: 'object',
        required: ['itemId', 'servicoId'],
        properties: {
          itemId: { type: 'integer' },
          servicoId: { type: 'integer' },
        }
      }
    },
    handler: ItemServicoController.create
  });

  // Listar todas as relações de usuários e servicos (rota protegida)
  fastify.get('/itemServicos', {
    handler: ItemServicoController.index
  });

  // Buscar relação entre usuário e servico pelo ID
  fastify.get<{ Params: { itemId: string, servicoId: string } }>('/itemServicos/:itemId/:servicoId', {
    schema: {
      params: {
        type: 'object',
        required: ['itemId', 'servicoId'],
        properties: {
          itemId: { type: 'string' },
          servicoId: { type: 'string' }
        }
      }
    },
    handler: ItemServicoController.show
  });


  // Deletar relação entre usuário e servico pelo ID
  fastify.delete<{ Params: { itemId: string, servicoId: string } }>('/itemServicos/:itemId/:servicoId', {
    schema: {
      params: {
        type: 'object',
        required: ['itemId', 'servicoId'],
        properties: {
          itemId: { type: 'string' },
          servicoId: { type: 'string' }
        }
      }
    },
    handler: ItemServicoController.delete
  });

  // Restaurar relação entre usuário e servico
  fastify.put<{ Params: { itemId: string, servicoId: string } }>('/itemServicos/restore/:itemId/:servicoId', {
    handler: ItemServicoController.restore
  });

  // Excluir permanentemente a relação entre usuário e servico
  fastify.delete<{ Params: { itemId: string, servicoId: string } }>('/itemServicos/purge/:itemId/:servicoId', {
    handler: ItemServicoController.purge
  });

  // Listar relações de usuários e servicos na lixeira (soft delete)
  fastify.get('/itemServicos/trash', {
    handler: ItemServicoController.trash
  });
}
