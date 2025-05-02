import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateContatoEmergenciaSchema, UpdateContatoEmergenciaSchema, CreateContatoEmergenciaInput, UpdateContatoEmergenciaInput } from '../models/ContatoEmergencia';
import { ContatoEmergenciaModel } from '../models/ContatoEmergencia';
import { ZodError } from 'zod';

export class ContatoEmergenciaController {
  static async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const ContatoEmergencias = await ContatoEmergenciaModel.findAll();
      return reply.code(200).send({ success: true, data: ContatoEmergencias });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async create(request: FastifyRequest<{ Body: CreateContatoEmergenciaInput }>, reply: FastifyReply) {
    try {
      const validatedData = CreateContatoEmergenciaSchema.parse(request.body);
      const ContatoEmergencia = await ContatoEmergenciaModel.create(validatedData);

      // Criar uma carteira para o usuário (se for Cliente (3) ou Trabalhador(2))
    /*  if (validatedData.profileId === 3 || validatedData.profileId === 2) {
        const carteira = await CarteiraModel.create({ ContatoEmergenciaId: ContatoEmergencia.id, credits: 0 });

        if (validatedData.profileId === 2) {
          // Criar o cliente com o address e carteiraId
          const cliente = await ClienteModel.create({
            address: validatedData.address ?? "",
            walletId: carteira.id,
          });

          // Relacionar o usuário ao cliente na tabela ContatoEmergencia_cliente
          await ContatoEmergenciaClienteModel.create({ ContatoEmergenciaId: ContatoEmergencia.id, clientId: cliente.id });
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

          // Relacionar o usuário ao trabalhador na tabela ContatoEmergencia_trabalhador
          await ContatoEmergenciaTrabalhadorModel.create({ ContatoEmergenciaId: ContatoEmergencia.id, workerId: trabalhador.id });
        }
      }*/

      return reply.code(201).send({ success: true, data: ContatoEmergencia });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ success: false, message: 'Validation error', errors: error.errors });
      }
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  // Novo endpoint para fazer upload da imagem e atualizar avatarUrl
  /*static async uploadAvatar(request: FastifyRequest<{ Body: { ContatoEmergenciaId: number } }>, reply: FastifyReply) {
    try {
      const data = await request.file(); // Fastify-multipart deve estar configurado
      const ContatoEmergenciaId = Number(request.body.ContatoEmergenciaId.toString());

      if (!data) {
        return reply.code(400).send({ success: false, message: 'No image uploaded' });
      }

      // Upload no Cloudinary
      const buffer = await data.toBuffer();
      cloudinary.uploader.upload_stream(
        { folder: 'ContatoEmergencias_avatars' },
        async (error, cloudinaryResponse) => {
          if (error || !cloudinaryResponse) {
            return reply.code(500).send({ success: false, message: 'Error uploading image', error: error?.message });
          }

          // Atualizar o avatarUrl do usuário dentro do callback
          await ContatoEmergenciaModel.update(ContatoEmergenciaId, { avatarUrl: cloudinaryResponse.secure_url });

          return reply.code(200).send({ success: true, avatarUrl: cloudinaryResponse.secure_url });
        }
      ).end(buffer);
    } catch (error) {
      return reply.code(500).send({ success: false, message: 'Error uploading image', error: (error as Error).message });
    }
  }*/

  static async show(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const ContatoEmergencia = await ContatoEmergenciaModel.findById(parseInt(request.params.id));
      if (!ContatoEmergencia) {
        return reply.code(404).send({ success: false, message: 'ContatoEmergencia not found' });
      }
      return reply.code(200).send({ success: true, data: ContatoEmergencia });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  static async update(request: FastifyRequest<{ Params: { id: string }, Body: UpdateContatoEmergenciaInput }>, reply: FastifyReply) {
    try {
      const validatedData = UpdateContatoEmergenciaSchema.parse(request.body);
      const ContatoEmergencia = await ContatoEmergenciaModel.update(parseInt(request.params.id), validatedData);
      return reply.code(200).send({ success: true, data: ContatoEmergencia });
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
      const ContatoEmergencia = await ContatoEmergenciaModel.restore(parseInt(request.params.id));
      return reply.code(200).send({ success: true , data: ContatoEmergencia});
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
      const ContatoEmergencias = await ContatoEmergenciaModel.trash();
      return reply.code(200).send({ success: true, data: ContatoEmergencias });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await ContatoEmergenciaModel.delete(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'ContatoEmergencia deleted successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  static async purge(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await ContatoEmergenciaModel.purge(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'ContatoEmergencia purged successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
}
