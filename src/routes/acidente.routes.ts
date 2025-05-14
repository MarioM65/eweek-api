import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { AcidenteController } from '../controllers/acidenteController'

export async function acidenteRoutes(fastify: FastifyInstance) {
  // Criar uma nova Acidente
  fastify.post('/acidentes', {
    schema: {
      body: {   
        type: 'object',
 properties: {
    tipo: { type: 'string' },
    localizacao: { type: 'string' },
    data_hora: { type: 'string', format: 'date-time' },
    confirmado: { type: 'boolean' },
    gravidade: { type: 'string' },
    itemId: { type: 'number' },
    usuarioId: { type: 'number' }
  },
  required: ['tipo', 'localizacao', 'data_hora', 'confirmado', 'gravidade', 'itemId', 'usuarioId']
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
    fastify.get<{ Params: { id: string } }>('/acidentes/check/:id', {
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
    handler: AcidenteController.check
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
        type: 'object'
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
