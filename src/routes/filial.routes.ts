import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { FilialController } from '../controllers/filialController'

export async function filialRoutes(fastify: FastifyInstance) {
  // Criar uma nova Filial
  fastify.post('/filials', {
    schema: {
      body: {
        type: 'object',
        required: [
          'vc_nome',
          'vc_telefone',
          'fl_lat',
          'fl_lon',
          'bl_central',
          'vc_email',
          'password'
        ],
        properties: {
          vc_nome: { type: 'string', minLength: 2 },
          vc_telefone: { type: 'string', minLength: 9 },
          fl_lat: { type: 'number' },
          fl_lon: { type: 'number' },
          bl_central: { type: 'boolean' },
          vc_email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          seguradoraId: { type: 'number' },
          parceiroId: { type: 'number' }
        }
      }
    },
    handler: FilialController.create
  })

  // Listar todas as Filials
  fastify.get('/filials', {
    handler: FilialController.index
  })

  // Buscar Filial pelo ID
  fastify.get<{ Params: { id: string } }>('/filials/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    handler: FilialController.show
  })

  // Atualizar Filial pelo ID
  fastify.put<{ Params: { id: string }; Body: any }>('/filials/:id', {
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
          vc_telefone: { type: 'string', minLength: 9 },
          fl_lat: { type: 'number' },
          fl_lon: { type: 'number' },
          bl_central: { type: 'boolean' },
          vc_email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
          seguradoraId: { type: 'number' },
          parceiroId: { type: 'number' }
        }
      }
    },
    handler: FilialController.update
  })

  // Deletar Filial pelo ID
  fastify.delete<{ Params: { id: string } }>('/filials/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    handler: FilialController.delete
  })

  // Restaurar Filial
  fastify.put<{ Params: { id: string } }>('/filials/restore/:id', {
    handler: FilialController.restore
  })

  // Excluir Filial permanentemente
  fastify.delete<{ Params: { id: string } }>('/filials/purge/:id', {
    handler: FilialController.purge
  })

  // Listar Filials na lixeira
  fastify.get('/filials/trash', {
    handler: FilialController.trash
  })
}
