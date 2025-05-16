import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { SeguradoraParceiroController } from '../controllers/seguradoraParceiroController'

export async function seguradoraParceiroRoutes(fastify: FastifyInstance) {
  // Criar uma nova relação entre usuário e seguradora
  fastify.post('/seguradoraParceiros', {
    schema: {
      body: {
        type: 'object',
        required: ['parceiroId', 'seguradoraId'],
        properties: {
          parceiroId: { type: 'integer' },
          seguradoraId: { type: 'integer' },
        }
      }
    },
    handler: SeguradoraParceiroController.create
  });

  // Listar todas as relações de usuários e seguradoras (rota protegida)
  fastify.get('/seguradoraParceiros', {
    handler: SeguradoraParceiroController.index
  });

  // Buscar relação entre usuário e seguradora pelo ID
  fastify.get<{ Params: { parceiroId: string, seguradoraId: string } }>('/seguradoraParceiros/:parceiroId/:seguradoraId', {
    schema: {
      params: {
        type: 'object',
        required: ['parceiroId', 'seguradoraId'],
        properties: {
          parceiroId: { type: 'string' },
          seguradoraId: { type: 'string' }
        }
      }
    },
    handler: SeguradoraParceiroController.show
  });


  // Deletar relação entre usuário e seguradora pelo ID
  fastify.delete<{ Params: { parceiroId: string, seguradoraId: string } }>('/seguradoraParceiros/:parceiroId/:seguradoraId', {
    schema: {
      params: {
        type: 'object',
        required: ['parceiroId', 'seguradoraId'],
        properties: {
          parceiroId: { type: 'string' },
          seguradoraId: { type: 'string' }
        }
      }
    },
    handler: SeguradoraParceiroController.delete
  });

  // Restaurar relação entre usuário e seguradora
  fastify.put<{ Params: { parceiroId: string, seguradoraId: string } }>('/seguradoraParceiros/restore/:parceiroId/:seguradoraId', {
    handler: SeguradoraParceiroController.restore
  });

  // Excluir permanentemente a relação entre usuário e seguradora
  fastify.delete<{ Params: { parceiroId: string, seguradoraId: string } }>('/seguradoraParceiros/purge/:parceiroId/:seguradoraId', {
    handler: SeguradoraParceiroController.purge
  });

  // Listar relações de usuários e seguradoras na lixeira (soft delete)
  fastify.get('/seguradoraParceiros/trash', {
    handler: SeguradoraParceiroController.trash
  });
}
