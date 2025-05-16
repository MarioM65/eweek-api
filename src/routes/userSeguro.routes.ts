import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { UserSeguroController } from '../controllers/userSeguroController'

export async function userSeguroRoutes(fastify: FastifyInstance) {
  // Criar uma nova relação entre usuário e seguro
  fastify.post('/userSeguros', {
    schema: {
      body: {
        type: 'object',
        required: ['userId', 'seguroId'],
        properties: {
          userId: { type: 'integer' },
          seguroId: { type: 'integer' },
        }
      }
    },
    handler: UserSeguroController.create
  });

  // Listar todas as relações de usuários e seguros (rota protegida)
  fastify.get('/userSeguros', {
    handler: UserSeguroController.index
  });

  // Buscar relação entre usuário e seguro pelo ID
  fastify.get<{ Params: { userId: string, seguroId: string } }>('/userSeguros/:userId/:seguroId', {
    schema: {
      params: {
        type: 'object',
        required: ['userId', 'seguroId'],
        properties: {
          userId: { type: 'string' },
          seguroId: { type: 'string' }
        }
      }
    },
    handler: UserSeguroController.show
  });


  // Deletar relação entre usuário e seguro pelo ID
  fastify.delete<{ Params: { userId: string, seguroId: string } }>('/userSeguros/:userId/:seguroId', {
    schema: {
      params: {
        type: 'object',
        required: ['userId', 'seguroId'],
        properties: {
          userId: { type: 'string' },
          seguroId: { type: 'string' }
        }
      }
    },
    handler: UserSeguroController.delete
  });

  // Restaurar relação entre usuário e seguro
  fastify.put<{ Params: { userId: string, seguroId: string } }>('/userSeguros/restore/:userId/:seguroId', {
    handler: UserSeguroController.restore
  });

  // Excluir permanentemente a relação entre usuário e seguro
  fastify.delete<{ Params: { userId: string, seguroId: string } }>('/userSeguros/purge/:userId/:seguroId', {
    handler: UserSeguroController.purge
  });

  // Listar relações de usuários e seguros na lixeira (soft delete)
  fastify.get('/userSeguros/trash', {
    handler: UserSeguroController.trash
  });
}
