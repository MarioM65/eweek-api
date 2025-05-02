import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateSeguroSchema, UpdateSeguroSchema, CreateSeguroInput, UpdateSeguroInput } from '../models/Seguro';
import { SeguroModel } from '../models/Seguro';
import { ZodError } from 'zod';

export class SeguroController {
  static async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const Seguros = await SeguroModel.findAll();
      return reply.code(200).send({ success: true, data: Seguros });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async create(request: FastifyRequest<{ Body: CreateSeguroInput }>, reply: FastifyReply) {
    try {
      const validatedData = CreateSeguroSchema.parse(request.body);
      const Seguro = await SeguroModel.create(validatedData);

      // Criar uma carteira para o usuário (se for Cliente (3) ou Trabalhador(2))
    /*  if (validatedData.profileId === 3 || validatedData.profileId === 2) {
        const carteira = await CarteiraModel.create({ SeguroId: Seguro.id, credits: 0 });

        if (validatedData.profileId === 2) {
          // Criar o cliente com o address e carteiraId
          const cliente = await ClienteModel.create({
            address: validatedData.address ?? "",
            walletId: carteira.id,
          });

          // Relacionar o usuário ao cliente na tabela Seguro_cliente
          await SeguroClienteModel.create({ SeguroId: Seguro.id, clientId: cliente.id });
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

          // Relacionar o usuário ao trabalhador na tabela Seguro_trabalhador
          await SeguroTrabalhadorModel.create({ SeguroId: Seguro.id, workerId: trabalhador.id });
        }
      }*/

      return reply.code(201).send({ success: true, data: Seguro });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ success: false, message: 'Validation error', errors: error.errors });
      }
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  // Novo endpoint para fazer upload da imagem e atualizar avatarUrl
  /*static async uploadAvatar(request: FastifyRequest<{ Body: { SeguroId: number } }>, reply: FastifyReply) {
    try {
      const data = await request.file(); // Fastify-multipart deve estar configurado
      const SeguroId = Number(request.body.SeguroId.toString());

      if (!data) {
        return reply.code(400).send({ success: false, message: 'No image uploaded' });
      }

      // Upload no Cloudinary
      const buffer = await data.toBuffer();
      cloudinary.uploader.upload_stream(
        { folder: 'Seguros_avatars' },
        async (error, cloudinaryResponse) => {
          if (error || !cloudinaryResponse) {
            return reply.code(500).send({ success: false, message: 'Error uploading image', error: error?.message });
          }

          // Atualizar o avatarUrl do usuário dentro do callback
          await SeguroModel.update(SeguroId, { avatarUrl: cloudinaryResponse.secure_url });

          return reply.code(200).send({ success: true, avatarUrl: cloudinaryResponse.secure_url });
        }
      ).end(buffer);
    } catch (error) {
      return reply.code(500).send({ success: false, message: 'Error uploading image', error: (error as Error).message });
    }
  }*/

  static async show(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const Seguro = await SeguroModel.findById(parseInt(request.params.id));
      if (!Seguro) {
        return reply.code(404).send({ success: false, message: 'Seguro not found' });
      }
      return reply.code(200).send({ success: true, data: Seguro });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  static async update(request: FastifyRequest<{ Params: { id: string }, Body: UpdateSeguroInput }>, reply: FastifyReply) {
    try {
      const validatedData = UpdateSeguroSchema.parse(request.body);
      const Seguro = await SeguroModel.update(parseInt(request.params.id), validatedData);
      return reply.code(200).send({ success: true, data: Seguro });
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
      const Seguro = await SeguroModel.restore(parseInt(request.params.id));
      return reply.code(200).send({ success: true , data: Seguro});
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
      const Seguros = await SeguroModel.trash();
      return reply.code(200).send({ success: true, data: Seguros });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await SeguroModel.delete(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'Seguro deleted successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async purge(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await SeguroModel.purge(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'Seguro purged successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
}
