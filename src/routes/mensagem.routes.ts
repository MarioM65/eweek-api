import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { MensagemController } from '../controllers/mensagemController';

export async function mensagemRoutes(fastify: FastifyInstance) {
  // Criar uma novaMensagem
  fastify.post('/mensagems', {
    schema: {
      body: {
        type: 'object',
        required: [
          'conteudo', 'dataEnvio', 'chatId',
          'userId'
        ],
        properties: {
          conteudo: { type: 'string', minLength: 2 },
          dataEnvio: {
  type: 'string',
  format: 'date-time' // ou 'date', dependendo do que queres
},
          chatId: { type: 'number' },
          userId: { type: 'number' },
          respostaId: { type: 'number' }
        }
      }
    },
    handler:MensagemController.create
  });

  // Listar todas asMensagems
  fastify.get('/mensagems', {
    onRequest: [authenticateToken],
    handler:MensagemController.index
  });

  // BuscarMensagem pelo ID
  fastify.get<{ Params: { id: string } }>('/mensagems/:id', {
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
    handler:MensagemController.show
  });

  // AtualizarMensagem pelo ID
  fastify.put<{ Params: { id: string }; Body: any }>('/mensagems/:id', {
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
          conteudo: { type: 'string', minLength: 2 },
          dataEnvio: { type: 'string', minLength: 2 },
          chatId: { type: 'number' },
          userId: { type: 'number' },
          respostaId: { type: 'number' }
        }
      }
    },
    handler:MensagemController.update
  });

  // DeletarMensagem pelo ID
  fastify.delete<{ Params: { id: string } }>('/mensagems/:id', {
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
    handler:MensagemController.delete
  });

  // RestaurarMensagem
  fastify.put<{ Params: { id: string } }>('/mensagems/restore/:id', {
    onRequest: [authenticateToken],
    handler:MensagemController.restore
  });

  // ExcluirMensagem permanentemente
  fastify.delete<{ Params: { id: string } }>('/mensagems/purge/:id', {
    onRequest: [authenticateToken],
    handler:MensagemController.purge
  });

  // ListarMensagems na lixeira
  fastify.get('/mensagems/trash', {
    onRequest: [authenticateToken],
    handler:MensagemController.trash
  });
}
