import { FastifyRequest, FastifyReply } from 'fastify';
import { ZodError } from 'zod';
import { SeguradoraModel, CreateSeguradoraInput, CreateSeguradoraSchema, UpdateSeguradoraInput, UpdateSeguradoraSchema } from '../models/seguradora';

export class SeguradoraController {
  static async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const Seguradoras = await SeguradoraModel.findAll();
      return reply.code(200).send({ success: true, data: Seguradoras });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async create(request: FastifyRequest<{ Body: CreateSeguradoraInput }>, reply: FastifyReply) {
    try {
      const validatedData = CreateSeguradoraSchema.parse(request.body);
      const Seguradora = await SeguradoraModel.create(validatedData);

      // Criar uma carteira para o usuário (se for Cliente (3) ou Trabalhador(2))
    /*  if (validatedData.profileId === 3 || validatedData.profileId === 2) {
        const carteira = await CarteiraModel.create({ SeguradoraId: Seguradora.id, credits: 0 });

        if (validatedData.profileId === 2) {
          // Criar o cliente com o address e carteiraId
          const cliente = await ClienteModel.create({
            address: validatedData.address ?? "",
            walletId: carteira.id,
          });

          // Relacionar o usuário ao cliente na tabela Seguradora_cliente
          await SeguradoraClienteModel.create({ SeguradoraId: Seguradora.id, clientId: cliente.id });
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

          // Relacionar o usuário ao trabalhador na tabela Seguradora_trabalhador
          await SeguradoraTrabalhadorModel.create({ SeguradoraId: Seguradora.id, workerId: trabalhador.id });
        }
      }*/

      return reply.code(201).send({ success: true, data: Seguradora });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ success: false, message: 'Validation error', errors: error.errors });
      }
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  // Novo endpoint para fazer upload da imagem e atualizar avatarUrl
  /*static async uploadAvatar(request: FastifyRequest<{ Body: { SeguradoraId: number } }>, reply: FastifyReply) {
    try {
      const data = await request.file(); // Fastify-multipart deve estar configurado
      const SeguradoraId = Number(request.body.SeguradoraId.toString());

      if (!data) {
        return reply.code(400).send({ success: false, message: 'No image uploaded' });
      }

      // Upload no Cloudinary
      const buffer = await data.toBuffer();
      cloudinary.uploader.upload_stream(
        { folder: 'Seguradoras_avatars' },
        async (error, cloudinaryResponse) => {
          if (error || !cloudinaryResponse) {
            return reply.code(500).send({ success: false, message: 'Error uploading image', error: error?.message });
          }

          // Atualizar o avatarUrl do usuário dentro do callback
          await SeguradoraModel.update(SeguradoraId, { avatarUrl: cloudinaryResponse.secure_url });

          return reply.code(200).send({ success: true, avatarUrl: cloudinaryResponse.secure_url });
        }
      ).end(buffer);
    } catch (error) {
      return reply.code(500).send({ success: false, message: 'Error uploading image', error: (error as Error).message });
    }
  }*/

  static async show(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const Seguradora = await SeguradoraModel.findById(parseInt(request.params.id));
      if (!Seguradora) {
        return reply.code(404).send({ success: false, message: 'Seguradora not found' });
      }
      return reply.code(200).send({ success: true, data: Seguradora });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  static async update(request: FastifyRequest<{ Params: { id: string }, Body: UpdateSeguradoraInput }>, reply: FastifyReply) {
    try {
      const validatedData = UpdateSeguradoraSchema.parse(request.body);
      const Seguradora = await SeguradoraModel.update(parseInt(request.params.id), validatedData);
      return reply.code(200).send({ success: true, data: Seguradora });
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
      const Seguradora = await SeguradoraModel.restore(parseInt(request.params.id));
      return reply.code(200).send({ success: true , data: Seguradora});
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
      const Seguradoras = await SeguradoraModel.trash();
      return reply.code(200).send({ success: true, data: Seguradoras });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await SeguradoraModel.delete(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'Seguradora deleted successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async purge(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await SeguradoraModel.purge(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'Seguradora purged successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
}
