import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { ParceiroController } from '../controllers/parceiroController'

export async function parceiroRoutes(fastify: FastifyInstance) {
  // Criar uma nova parceiro
  fastify.post('/parceiros', {
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
    handler: ParceiroController.create
  });

  // Listar todas as parceiros
  fastify.get('/parceiros', {
    handler: ParceiroController.index
  });

  // Buscar parceiro pelo ID
  fastify.get<{ Params: { id: string } }>('/parceiros/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    handler: ParceiroController.show
  });

  // Atualizar parceiro pelo ID
  fastify.put<{ Params: { id: string }; Body: any }>('/parceiros/:id', {
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
    handler: ParceiroController.update
  });

  // Deletar parceiro pelo ID
  fastify.delete<{ Params: { id: string } }>('/parceiros/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    handler: ParceiroController.delete
  });

  // Restaurar parceiro
  fastify.put<{ Params: { id: string } }>('/parceiros/restore/:id', {
    handler: ParceiroController.restore
  });

  // Excluir parceiro permanentemente
  fastify.delete<{ Params: { id: string } }>('/parceiros/purge/:id', {
    handler: ParceiroController.purge
  });

  // Listar parceiros na lixeira
  fastify.get('/parceiros/trash', {
    handler: ParceiroController.trash
  });
}
