import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { AcidenteController } from '../controllers/acidenteController'

export async function acidenteRoutes(fastify: FastifyInstance) {
  // Criar uma nova Acidente
  fastify.post('/acidentes', {
    schema: {
      body: {
        type: 'object',
        required: [
          'vc_nome', 'tipo_Acidente', 'txt_descricao',
          'data_hora', 'localizacao', 'tipo',
          'confirmado', 'gravidade', 'itemId', 'usuarioId'
        ],
        properties: {
          vc_nome: { type: 'string', minLength: 2 },
          tipo_Acidente: { type: 'string' },
          txt_descricao: { type: 'string' },
          data_hora: { type: 'string', format: 'date-time' },
          localizacao: { type: 'string', minLength: 2 },
          tipo: { type: 'string', minLength: 2 },
          confirmado: { type: 'boolean' },
          gravidade: { type: 'string', minLength: 2 },
          itemId: { type: 'number' },
          usuarioId: { type: 'number' }
        }
      }
    },
    handler: AcidenteController.create
  });

  // Listar todas as Acidentes
  fastify.get('/acidentes', {
    onRequest: [authenticateToken],
    handler: AcidenteController.index
  });

  // Buscar Acidente pelo ID
  fastify.get<{ Params: { id: string } }>('/acidentes/:id', {
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
    handler: AcidenteController.show
  });

  // Atualizar Acidente pelo ID
  fastify.put<{ Params: { id: string }; Body: any }>('/acidentes/:id', {
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
          tipo_Acidente: { type: 'string' },
          txt_descricao: { type: 'string' },
          data_hora: { type: 'string', format: 'date-time' },
          localizacao: { type: 'string', minLength: 2 },
          tipo: { type: 'string', minLength: 2 },
          confirmado: { type: 'boolean' },
          gravidade: { type: 'string', minLength: 2 },
          itemId: { type: 'number' },
          usuarioId: { type: 'number' }
        }
      }
    },
    handler: AcidenteController.update
  });

  // Deletar Acidente pelo ID
  fastify.delete<{ Params: { id: string } }>('/acidentes/:id', {
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
    handler: AcidenteController.delete
  });

  // Restaurar Acidente
  fastify.put<{ Params: { id: string } }>('/acidentes/restore/:id', {
    onRequest: [authenticateToken],
    handler: AcidenteController.restore
  });

  // Excluir Acidente permanentemente
  fastify.delete<{ Params: { id: string } }>('/acidentes/purge/:id', {
    onRequest: [authenticateToken],
    handler: AcidenteController.purge
  });

  // Listar Acidentes na lixeira
  fastify.get('/acidentes/trash', {
    onRequest: [authenticateToken],
    handler: AcidenteController.trash
  });
}
