import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { NotificacaoModel, CreateNotificacaoInput, CreateNotificacaoSchema, UpdateNotificacaoInput, UpdateNotificacaoSchema } from '../models/Notificacao';

export class NotificacaoController {
  static async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const Notificacaos = await NotificacaoModel.findAll();
      return reply.code(200).send({ success: true, data: Notificacaos });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async create(request: FastifyRequest<{ Body: CreateNotificacaoInput }>, reply: FastifyReply) {
    try {
      const validatedData = CreateNotificacaoSchema.parse(request.body);
      const Notificacao = await NotificacaoModel.create(validatedData);

      // Criar uma carteira para o usuário (se for Cliente (3) ou Trabalhador(2))
    /*  if (validatedData.profileId === 3 || validatedData.profileId === 2) {
        const carteira = await CarteiraModel.create({ NotificacaoId: Notificacao.id, credits: 0 });

        if (validatedData.profileId === 2) {
          // Criar o cliente com o address e carteiraId
          const cliente = await ClienteModel.create({
            address: validatedData.address ?? "",
            walletId: carteira.id,
          });

          // Relacionar o usuário ao cliente na tabela Notificacao_cliente
          await NotificacaoClienteModel.create({ NotificacaoId: Notificacao.id, clientId: cliente.id });
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

          // Relacionar o usuário ao trabalhador na tabela Notificacao_trabalhador
          await NotificacaoTrabalhadorModel.create({ NotificacaoId: Notificacao.id, workerId: trabalhador.id });
        }
      }*/

      return reply.code(201).send({ success: true, data: Notificacao });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ success: false, message: 'Validation error', errors: error.errors });
      }
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  // Novo endpoint para fazer upload da imagem e atualizar avatarUrl
  /*static async uploadAvatar(request: FastifyRequest<{ Body: { NotificacaoId: number } }>, reply: FastifyReply) {
    try {
      const data = await request.file(); // Fastify-multipart deve estar configurado
      const NotificacaoId = Number(request.body.NotificacaoId.toString());

      if (!data) {
        return reply.code(400).send({ success: false, message: 'No image uploaded' });
      }

      // Upload no Cloudinary
      const buffer = await data.toBuffer();
      cloudinary.uploader.upload_stream(
        { folder: 'Notificacaos_avatars' },
        async (error, cloudinaryResponse) => {
          if (error || !cloudinaryResponse) {
            return reply.code(500).send({ success: false, message: 'Error uploading image', error: error?.message });
          }

          // Atualizar o avatarUrl do usuário dentro do callback
          await NotificacaoModel.update(NotificacaoId, { avatarUrl: cloudinaryResponse.secure_url });

          return reply.code(200).send({ success: true, avatarUrl: cloudinaryResponse.secure_url });
        }
      ).end(buffer);
    } catch (error) {
      return reply.code(500).send({ success: false, message: 'Error uploading image', error: (error as Error).message });
    }
  }*/

  static async show(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const Notificacao = await NotificacaoModel.findById(parseInt(request.params.id));
      if (!Notificacao) {
        return reply.code(404).send({ success: false, message: 'Notificacao not found' });
      }
      return reply.code(200).send({ success: true, data: Notificacao });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  static async update(request: FastifyRequest<{ Params: { id: string }, Body: UpdateNotificacaoInput }>, reply: FastifyReply) {
    try {
      const validatedData = UpdateNotificacaoSchema.parse(request.body);
      const Notificacao = await NotificacaoModel.update(parseInt(request.params.id), validatedData);
      return reply.code(200).send({ success: true, data: Notificacao });
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
      const Notificacao = await NotificacaoModel.restore(parseInt(request.params.id));
      return reply.code(200).send({ success: true , data: Notificacao});
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
      const Notificacaos = await NotificacaoModel.trash();
      return reply.code(200).send({ success: true, data: Notificacaos });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await NotificacaoModel.delete(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'Notificacao deleted successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async purge(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await NotificacaoModel.purge(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'Notificacao purged successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
}
