import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { SeguroServicoController } from '../controllers/seguroServicoController'

export async function seguroServicoRoutes(fastify: FastifyInstance) {
  // Criar uma nova relação entre usuário e servico
  fastify.post('/seguroServicos', {
    schema: {
      body: {
        type: 'object',
        required: ['seguroId', 'servicoId'],
        properties: {
          seguroId: { type: 'integer' },
          servicoId: { type: 'integer' },
        }
      }
    },
    handler: SeguroServicoController.create
  });

  // Listar todas as relações de usuários e servicos (rota protegida)
  fastify.get('/seguroServicos', {
    handler: SeguroServicoController.index
  });

  // Buscar relação entre usuário e servico pelo ID
  fastify.get<{ Params: { seguroId: string, servicoId: string } }>('/seguroServicos/:seguroId/:servicoId', {
    schema: {
      params: {
        type: 'object',
        required: ['seguroId', 'servicoId'],
        properties: {
          seguroId: { type: 'string' },
          servicoId: { type: 'string' }
        }
      }
    },
    handler: SeguroServicoController.show
  });


  // Deletar relação entre usuário e servico pelo ID
  fastify.delete<{ Params: { seguroId: string, servicoId: string } }>('/seguroServicos/:seguroId/:servicoId', {
    schema: {
      params: {
        type: 'object',
        required: ['seguroId', 'servicoId'],
        properties: {
          seguroId: { type: 'string' },
          servicoId: { type: 'string' }
        }
      }
    },
    handler: SeguroServicoController.delete
  });

  // Restaurar relação entre usuário e servico
  fastify.put<{ Params: { seguroId: string, servicoId: string } }>('/seguroServicos/restore/:seguroId/:servicoId', {
    handler: SeguroServicoController.restore
  });

  // Excluir permanentemente a relação entre usuário e servico
  fastify.delete<{ Params: { seguroId: string, servicoId: string } }>('/seguroServicos/purge/:seguroId/:servicoId', {
    handler: SeguroServicoController.purge
  });

  // Listar relações de usuários e servicos na lixeira (soft delete)
  fastify.get('/seguroServicos/trash', {
    handler: SeguroServicoController.trash
  });
}
