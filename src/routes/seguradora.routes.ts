import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { SeguradoraController } from '../controllers/seguradoraController'

export async function seguradoraRoutes(fastify: FastifyInstance) {
  // Criar uma nova seguradora
  fastify.post('/seguradoras', {
    schema: {
      body: {
        type: 'object',
        required: ['vc_nome', 'logo', 'txt_descricao'],
        properties: {
          vc_nome: { type: 'string', minLength: 2 },
          logo: { type: 'string' },
          txt_descricao: { type: 'string' }
        }
      }
    },
    handler: SeguradoraController.create
  });

  // Listar todas as seguradoras
  fastify.get('/seguradoras', {
    onRequest: [authenticateToken],
    handler: SeguradoraController.index
  });

  // Buscar seguradora pelo ID
  fastify.get<{ Params: { id: string } }>('/seguradoras/:id', {
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
    handler: SeguradoraController.show
  });

  // Atualizar seguradora pelo ID
  fastify.put<{ Params: { id: string }; Body: any }>('/seguradoras/:id', {
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
          logo: { type: 'string' },
          txt_descricao: { type: 'string' }
        }
      }
    },
    handler: SeguradoraController.update
  });

  // Deletar seguradora pelo ID
  fastify.delete<{ Params: { id: string } }>('/seguradoras/:id', {
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
    handler: SeguradoraController.delete
  });

  // Restaurar seguradora
  fastify.put<{ Params: { id: string } }>('/seguradoras/restore/:id', {
    onRequest: [authenticateToken],
    handler: SeguradoraController.restore
  });

  // Excluir seguradora permanentemente
  fastify.delete<{ Params: { id: string } }>('/seguradoras/purge/:id', {
    onRequest: [authenticateToken],
    handler: SeguradoraController.purge
  });

  // Listar seguradoras na lixeira
  fastify.get('/seguradoras/trash', {
    onRequest: [authenticateToken],
    handler: SeguradoraController.trash
  });
}
