import { FastifyRequest, FastifyReply } from 'fastify';
import { CreatePagamentoSchema, UpdatePagamentoSchema, CreatePagamentoInput, UpdatePagamentoInput } from '../models/Pagamento';
import { PagamentoModel } from '../models/Pagamento';
import { ZodError } from 'zod';

export class PagamentoController {
  static async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const Pagamentos = await PagamentoModel.findAll();
      return reply.code(200).send({ success: true, data: Pagamentos });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async create(request: FastifyRequest<{ Body: CreatePagamentoInput }>, reply: FastifyReply) {
    try {
      const validatedData = CreatePagamentoSchema.parse(request.body);
      const Pagamento = await PagamentoModel.create(validatedData);

      // Criar uma carteira para o usuário (se for Cliente (3) ou Trabalhador(2))
    /*  if (validatedData.profileId === 3 || validatedData.profileId === 2) {
        const carteira = await CarteiraModel.create({ PagamentoId: Pagamento.id, credits: 0 });

        if (validatedData.profileId === 2) {
          // Criar o cliente com o address e carteiraId
          const cliente = await ClienteModel.create({
            address: validatedData.address ?? "",
            walletId: carteira.id,
          });

          // Relacionar o usuário ao cliente na tabela Pagamento_cliente
          await PagamentoClienteModel.create({ PagamentoId: Pagamento.id, clientId: cliente.id });
        }

        if (validatedData.profileId === 2) {
          // Criar o trabalhador com os dados adicionais e carteiraId
          const trabalhador = await TrabalhadorModel.create({
            walletId: carteira.id,  // Corrigido
            description: validatedData.description ?? "",
            profession: validatedData.profession ?? "",
            address: validatedData.address ?? "",
            totalServices: 0,
            verified: false
          });

          // Relacionar o usuário ao trabalhador na tabela Pagamento_trabalhador
          await PagamentoTrabalhadorModel.create({ PagamentoId: Pagamento.id, workerId: trabalhador.id });
        }
      }*/

      return reply.code(201).send({ success: true, data: Pagamento });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ success: false, message: 'Validation error', errors: error.errors });
      }
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  // Novo endpoint para fazer upload da imagem e atualizar avatarUrl
  /*static async uploadAvatar(request: FastifyRequest<{ Body: { PagamentoId: number } }>, reply: FastifyReply) {
    try {
      const data = await request.file(); // Fastify-multipart deve estar configurado
      const PagamentoId = Number(request.body.PagamentoId.toString());

      if (!data) {
        return reply.code(400).send({ success: false, message: 'No image uploaded' });
      }

      // Upload no Cloudinary
      const buffer = await data.toBuffer();
      cloudinary.uploader.upload_stream(
        { folder: 'Pagamentos_avatars' },
        async (error, cloudinaryResponse) => {
          if (error || !cloudinaryResponse) {
            return reply.code(500).send({ success: false, message: 'Error uploading image', error: error?.message });
          }

          // Atualizar o avatarUrl do usuário dentro do callback
          await PagamentoModel.update(PagamentoId, { avatarUrl: cloudinaryResponse.secure_url });

          return reply.code(200).send({ success: true, avatarUrl: cloudinaryResponse.secure_url });
        }
      ).end(buffer);
    } catch (error) {
      return reply.code(500).send({ success: false, message: 'Error uploading image', error: (error as Error).message });
    }
  }*/

  static async show(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const Pagamento = await PagamentoModel.findById(parseInt(request.params.id));
      if (!Pagamento) {
        return reply.code(404).send({ success: false, message: 'Pagamento not found' });
      }
      return reply.code(200).send({ success: true, data: Pagamento });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  static async update(request: FastifyRequest<{ Params: { id: string }, Body: UpdatePagamentoInput }>, reply: FastifyReply) {
    try {
      const validatedData = UpdatePagamentoSchema.parse(request.body);
      const Pagamento = await PagamentoModel.update(parseInt(request.params.id), validatedData);
      return reply.code(200).send({ success: true, data: Pagamento });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ success: false, message: 'Validation error', errors: error.errors });
      }
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async restore(request: FastifyRequest<{ Params: { id: string }}>, reply: FastifyReply) {
    try {
      const Pagamento = await PagamentoModel.restore(parseInt(request.params.id));
      return reply.code(200).send({ success: true , data: Pagamento});
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ success: false, message: 'Validation error', errors: error.errors });
      }
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async trash(request: FastifyRequest, reply: FastifyReply) {
    try {
      const Pagamentos = await PagamentoModel.trash();
      return reply.code(200).send({ success: true, data: Pagamentos });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await PagamentoModel.delete(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'Pagamento deleted successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async purge(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await PagamentoModel.purge(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'Pagamento purged successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
}
