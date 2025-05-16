import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { UserSeguradoraController } from '../controllers/userSeguradoraController'

export async function userSeguradoraRoutes(fastify: FastifyInstance) {
  // Criar uma nova relação entre usuário e seguradora
  fastify.post('/userSeguradoras', {
    schema: {
      body: {
        type: 'object',
        required: ['userId', 'seguradoraId'],
        properties: {
          userId: { type: 'integer' },
          seguradoraId: { type: 'integer' },
        }
      }
    },
    handler: UserSeguradoraController.create
  });

  // Listar todas as relações de usuários e seguradoras (rota protegida)
  fastify.get('/userSeguradoras', {
    handler: UserSeguradoraController.index
  });

  // Buscar relação entre usuário e seguradora pelo ID
  fastify.get<{ Params: { userId: string, seguradoraId: string } }>('/userSeguradoras/:userId/:seguradoraId', {
    schema: {
      params: {
        type: 'object',
        required: ['userId', 'seguradoraId'],
        properties: {
          userId: { type: 'string' },
          seguradoraId: { type: 'string' }
        }
      }
    },
    handler: UserSeguradoraController.show
  });


  // Deletar relação entre usuário e seguradora pelo ID
  fastify.delete<{ Params: { userId: string, seguradoraId: string } }>('/userSeguradoras/:userId/:seguradoraId', {
    schema: {
      params: {
        type: 'object',
        required: ['userId', 'seguradoraId'],
        properties: {
          userId: { type: 'string' },
          seguradoraId: { type: 'string' }
        }
      }
    },
    handler: UserSeguradoraController.delete
  });

  // Restaurar relação entre usuário e seguradora
  fastify.put<{ Params: { userId: string, seguradoraId: string } }>('/userSeguradoras/restore/:userId/:seguradoraId', {
    handler: UserSeguradoraController.restore
  });

  // Excluir permanentemente a relação entre usuário e seguradora
  fastify.delete<{ Params: { userId: string, seguradoraId: string } }>('/userSeguradoras/purge/:userId/:seguradoraId', {
    handler: UserSeguradoraController.purge
  });

  // Listar relações de usuários e seguradoras na lixeira (soft delete)
  fastify.get('/userSeguradoras/trash', {
    handler: UserSeguradoraController.trash
  });
}
