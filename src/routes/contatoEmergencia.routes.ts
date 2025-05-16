import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { ContatoEmergenciaController } from '../controllers/contatoEmergenciaController'

export async function contatoEmergenciaRoutes(fastify: FastifyInstance) {
  // Criar uma nova contatoEmergencia
  fastify.post('/contatoEmergencias', {
    schema: {
      body: {
        type: 'object',
        required: ['vc_nome', 'vc_telefone', 'parentesco'],
        properties: {
          vc_nome: { type: 'string', minLength: 2 },
            vc_email: { type: 'string', minLength: 2 },
          vc_telefone: { type: 'string' },
          parentesco: { type: 'string' },
          userId: { type: 'integer' },
        }
      }
    },
    handler: ContatoEmergenciaController.create
  });

  // Listar todas as contatoEmergencias
  fastify.get('/contatoEmergencias', {
    handler: ContatoEmergenciaController.index
  });

  // Buscar contatoEmergencia pelo ID
  fastify.get<{ Params: { id: string } }>('/contatoEmergencias/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    handler: ContatoEmergenciaController.show
  });

  // Atualizar contatoEmergencia pelo ID
  fastify.put<{ Params: { id: string }; Body: any }>('/contatoEmergencias/:id', {
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
          vc_telefone: { type: 'string' },
          parentesco: { type: 'string' },
          userId: { type: 'integer' },
            vc_email: { type: 'string', minLength: 2 },
        }
      }
    },
    handler: ContatoEmergenciaController.update
  });

  // Deletar contatoEmergencia pelo ID
  fastify.delete<{ Params: { id: string } }>('/contatoEmergencias/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    handler: ContatoEmergenciaController.delete
  });

  // Restaurar contatoEmergencia
  fastify.put<{ Params: { id: string } }>('/contatoEmergencias/restore/:id', {
    handler: ContatoEmergenciaController.restore
  });

  // Excluir contatoEmergencia permanentemente
  fastify.delete<{ Params: { id: string } }>('/contatoEmergencias/purge/:id', {
    handler: ContatoEmergenciaController.purge
  });

  // Listar contatoEmergencias na lixeira
  fastify.get('/contatoEmergencias/trash', {
    handler: ContatoEmergenciaController.trash
  });
}
