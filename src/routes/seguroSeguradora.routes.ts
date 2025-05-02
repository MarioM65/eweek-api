import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { SeguroSeguradoraController } from '../controllers/seguroSeguradoraController'

export async function seguroSeguradoraRoutes(fastify: FastifyInstance) {
  // Criar uma nova relação entre usuário e seguradora
  fastify.post('/seguroSeguradoras', {
    schema: {
      body: {
        type: 'object',
        required: ['seguroId', 'seguradoraId'],
        properties: {
          seguroId: { type: 'integer' },
          seguradoraId: { type: 'integer' },
        }
      }
    },
    handler: SeguroSeguradoraController.create
  });

  // Listar todas as relações de usuários e seguradoras (rota protegida)
  fastify.get('/seguroSeguradoras', {
    onRequest: [authenticateToken],
    handler: SeguroSeguradoraController.index
  });

  // Buscar relação entre usuário e seguradora pelo ID
  fastify.get<{ Params: { seguroId: string, seguradoraId: string } }>('/seguroSeguradoras/:seguroId/:seguradoraId', {
    onRequest: [authenticateToken],
    schema: {
      params: {
        type: 'object',
        required: ['seguroId', 'seguradoraId'],
        properties: {
          seguroId: { type: 'string' },
          seguradoraId: { type: 'string' }
        }
      }
    },
    handler: SeguroSeguradoraController.show
  });


  // Deletar relação entre usuário e seguradora pelo ID
  fastify.delete<{ Params: { seguroId: string, seguradoraId: string } }>('/seguroSeguradoras/:seguroId/:seguradoraId', {
    onRequest: [authenticateToken],
    schema: {
      params: {
        type: 'object',
        required: ['seguroId', 'seguradoraId'],
        properties: {
          seguroId: { type: 'string' },
          seguradoraId: { type: 'string' }
        }
      }
    },
    handler: SeguroSeguradoraController.delete
  });

  // Restaurar relação entre usuário e seguradora
  fastify.put<{ Params: { seguroId: string, seguradoraId: string } }>('/seguroSeguradoras/restore/:seguroId/:seguradoraId', {
    onRequest: [authenticateToken],
    handler: SeguroSeguradoraController.restore
  });

  // Excluir permanentemente a relação entre usuário e seguradora
  fastify.delete<{ Params: { seguroId: string, seguradoraId: string } }>('/seguroSeguradoras/purge/:seguroId/:seguradoraId', {
    onRequest: [authenticateToken],
    handler: SeguroSeguradoraController.purge
  });

  // Listar relações de usuários e seguradoras na lixeira (soft delete)
  fastify.get('/seguroSeguradoras/trash', {
    onRequest: [authenticateToken],
    handler: SeguroSeguradoraController.trash
  });
}
