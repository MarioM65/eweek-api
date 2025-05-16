import { NotificacaoController } from './../controllers/notificacaoController';
import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'

export async function notificacaoRoutes(fastify: FastifyInstance) {
  // Criar uma nova notificacao
  fastify.post('/notificacaos', {
    schema: {
      body: {
        type: 'object',
  required: [
    'dataLeitura',
    'dataCriacao',
    'mensagem',
    'tipo',
    'status',
    'userId'
  ],
  properties: {
    dataLeitura: { type: 'string', format: 'date-time' },
    dataCriacao: { type: 'string', format: 'date-time' },
    mensagem: { type: 'string', minLength: 2 },
    tipo: { type: 'string', minLength: 2 },
    referencia: { type: 'string', minLength: 2 },
    status: { type: 'string', minLength: 2 },
    userId: { type: 'number' },
    referenciaId: { type: 'number' }
  }
      }
    },
    handler: NotificacaoController.create
  });

  // Listar todas as notificacaos
  fastify.get('/notificacaos', {
    handler: NotificacaoController.index
  });

  // Buscar notificacao pelo ID
  fastify.get<{ Params: { id: string } }>('/notificacaos/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    handler: NotificacaoController.show
  });

  // Atualizar notificacao pelo ID
  fastify.put<{ Params: { id: string }; Body: any }>('/notificacaos/:id', {
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
    dataLeitura: { type: 'string', format: 'date-time' },
    dataCriacao: { type: 'string', format: 'date-time' },
    mensagem: { type: 'string', minLength: 2 },
    tipo: { type: 'string', minLength: 2 },
    referencia: { type: 'string', minLength: 2 },
    status: { type: 'string', minLength: 2 },
    userId: { type: 'number' },
    referenciaId: { type: 'number' }
  }
      }
    },
    handler: NotificacaoController.update
  });

  // Deletar notificacao pelo ID
  fastify.delete<{ Params: { id: string } }>('/notificacaos/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    handler: NotificacaoController.delete
  });

  // Restaurar notificacao
  fastify.put<{ Params: { id: string } }>('/notificacaos/restore/:id', {
    handler: NotificacaoController.restore
  });

  // Excluir notificacao permanentemente
  fastify.delete<{ Params: { id: string } }>('/notificacaos/purge/:id', {
    handler: NotificacaoController.purge
  });

  // Listar notificacaos na lixeira
  fastify.get('/notificacaos/trash', {
    handler: NotificacaoController.trash
  });
}
