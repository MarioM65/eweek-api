import { FastifyInstance } from 'fastify'
import { authenticateToken } from '../../middleware'
import { PagamentoController } from '../controllers/pagamentoController'

export async function pagamentoRoutes(fastify: FastifyInstance) {
  // Criar uma nova pagamento
  fastify.post('/pagamentos', {
    schema: {
      body: {
        type: 'object',
        required: [
          'valor', 'dataPagamento', 'estado', 'apoliceId'
        ],
        properties: {
          valor: { type: 'number', minimum: 0 },
          dataPagamento: {
  type: 'string',
  format: 'date-time' // ou 'date', dependendo do que queres
},
          estado: { type: 'string' },
          apoliceId: { type: 'number' },
        }
      }
    },
    handler: PagamentoController.create
  });

  // Listar todas as pagamentos
  fastify.get('/pagamentos', {
    handler: PagamentoController.index
  });

  // Buscar pagamento pelo ID
  fastify.get<{ Params: { id: string } }>('/pagamentos/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    handler: PagamentoController.show
  });

  // Atualizar pagamento pelo ID
  fastify.put<{ Params: { id: string }; Body: any }>('/pagamentos/:id', {
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
          valor: { type: 'number', minimum:0},
          dataPagamento: {
  type: 'string',
  format: 'date-time' // ou 'date', dependendo do que queres
},
          estado: { type: 'string' },
          apoliceId: { type: 'number' },
        }
      }
    },
    handler: PagamentoController.update
  });

  // Deletar pagamento pelo ID
  fastify.delete<{ Params: { id: string } }>('/pagamentos/:id', {
    schema: {
      params: {
        type: 'object',
        required: ['id'],
        properties: {
          id: { type: 'string' }
        }
      }
    },
    handler: PagamentoController.delete
  });

  // Restaurar pagamento
  fastify.put<{ Params: { id: string } }>('/pagamentos/restore/:id', {
    handler: PagamentoController.restore
  });

  // Excluir pagamento permanentemente
  fastify.delete<{ Params: { id: string } }>('/pagamentos/purge/:id', {
    handler: PagamentoController.purge
  });

  // Listar pagamentos na lixeira
  fastify.get('/pagamentos/trash', {
    handler: PagamentoController.trash
  });
}
