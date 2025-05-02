import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { SeguroController } from '../controllers/seguroController'

export async function seguroRoutes(fastify: FastifyInstance) {
  // Criar uma nova seguro
  fastify.post('/seguros', {
    schema: {
      body: {
        type: 'object',
        required: ['vc_nome', 'fl_preco', 'txt_descricao'],
        properties: {
          vc_nome: { type: 'string', minLength: 2 },
          fl_preco: {type: 'number',exclusiveMinimum: 0},
          txt_descricao: { type: 'string' }
        }
      }
    },
    handler: SeguroController.create
  });

  // Listar todas as seguros
  fastify.get('/seguros', {
    onRequest: [authenticateToken],
    handler: SeguroController.index
  });

  // Buscar seguro pelo ID
  fastify.get<{ Params: { id: string } }>('/seguros/:id', {
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
    handler: SeguroController.show
  });

  // Atualizar seguro pelo ID
  fastify.put<{ Params: { id: string }; Body: any }>('/seguros/:id', {
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
          vc_nome: { type: 'string', minLength: 2 },
          fl_preco: {type: 'number',exclusiveMinimum: 0},
          txt_descricao: { type: 'string' }
        }
      }
    },
    handler: SeguroController.update
  });

  // Deletar seguro pelo ID
  fastify.delete<{ Params: { id: string } }>('/seguros/:id', {
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
    handler: SeguroController.delete
  });

  // Restaurar seguro
  fastify.put<{ Params: { id: string } }>('/seguros/restore/:id', {
    onRequest: [authenticateToken],
    handler: SeguroController.restore
  });

  // Excluir seguro permanentemente
  fastify.delete<{ Params: { id: string } }>('/seguros/purge/:id', {
    onRequest: [authenticateToken],
    handler: SeguroController.purge
  });

  // Listar seguros na lixeira
  fastify.get('/seguros/trash', {
    onRequest: [authenticateToken],
    handler: SeguroController.trash
  });
}
