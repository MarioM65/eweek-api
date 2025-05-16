import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { ChatController } from '../controllers/chatController'

export async function chatRoutes(fastify: FastifyInstance) {
  // Criar uma nova chat
  fastify.post('/chats', {
    schema: {
      body: {
        type: 'object',
        required: [
          'nome', 'criadoPor'
        ],
        properties: {
          nome: { type: 'string', minLength: 2 },
          criadoPor: { type: 'number' },
        }
      }
    },
    handler: ChatController.create
  });

  // Listar todas as chats
  fastify.get('/chats', {
    handler: ChatController.index
  });

  // Buscar chat pelo ID
  fastify.get<{ Params: { id: string } }>('/chats/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    handler: ChatController.show
  });

  // Atualizar chat pelo ID
  fastify.put<{ Params: { id: string }; Body: any }>('/chats/:id', {
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
          nome: { type: 'string', minLength: 2 },
          criadoPor: { type: 'number' },
        }
      }
    },
    handler: ChatController.update
  });

  // Deletar chat pelo ID
  fastify.delete<{ Params: { id: string } }>('/chats/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    handler: ChatController.delete
  });

  // Restaurar chat
  fastify.put<{ Params: { id: string } }>('/chats/restore/:id', {
    handler: ChatController.restore
  });

  // Excluir chat permanentemente
  fastify.delete<{ Params: { id: string } }>('/chats/purge/:id', {
    handler: ChatController.purge
  });

  // Listar chats na lixeira
  fastify.get('/chats/trash', {
    handler: ChatController.trash
  });
}
