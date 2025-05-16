import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { ServicoController } from '../controllers/servicoController'

export async function servicoRoutes(fastify: FastifyInstance) {
  // Criar uma nova servico
  fastify.post('/servicos', {
    schema: {
      body: {
        type: 'object',
        required: ['vc_nome', 'txt_descricao'],
        properties: {
          vc_nome: { type: 'string', minLength: 2 },
          txt_descricao: { type: 'string' }
        }
      }
    },
    handler: ServicoController.create
  });

  // Listar todas as servicos
  fastify.get('/servicos', {
    handler: ServicoController.index
  });

  // Buscar servico pelo ID
  fastify.get<{ Params: { id: string } }>('/servicos/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    handler: ServicoController.show
  });

  // Atualizar servico pelo ID
  fastify.put<{ Params: { id: string }; Body: any }>('/servicos/:id', {
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
          txt_descricao: { type: 'string' }
        }
      }
    },
    handler: ServicoController.update
  });

  // Deletar servico pelo ID
  fastify.delete<{ Params: { id: string } }>('/servicos/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    handler: ServicoController.delete
  });

  // Restaurar servico
  fastify.put<{ Params: { id: string } }>('/servicos/restore/:id', {
    handler: ServicoController.restore
  });

  // Excluir servico permanentemente
  fastify.delete<{ Params: { id: string } }>('/servicos/purge/:id', {
    handler: ServicoController.purge
  });

  // Listar servicos na lixeira
  fastify.get('/servicos/trash', {
    handler: ServicoController.trash
  });
}
