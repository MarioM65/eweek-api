import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateEntidadeSchema, UpdateEntidadeSchema, CreateEntidadeInput, UpdateEntidadeInput } from '../models/Entidade';
import { EntidadeModel } from '../models/Entidade';
import { ZodError } from 'zod';

export class EntidadeController {
  static async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const Entidades = await EntidadeModel.findAll();
      return reply.code(200).send({ success: true, data: Entidades });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async create(request: FastifyRequest<{ Body: CreateEntidadeInput }>, reply: FastifyReply) {
    try {
      const validatedData = CreateEntidadeSchema.parse(request.body);
      const Entidade = await EntidadeModel.create(validatedData);

      // Criar uma carteira para o usuário (se for Cliente (3) ou Trabalhador(2))
    /*  if (validatedData.profileId === 3 || validatedData.profileId === 2) {
        const carteira = await CarteiraModel.create({ EntidadeId: Entidade.id, credits: 0 });

        if (validatedData.profileId === 2) {
          // Criar o cliente com o address e carteiraId
          const cliente = await ClienteModel.create({
            address: validatedData.address ?? "",
            walletId: carteira.id,
          });

          // Relacionar o usuário ao cliente na tabela Entidade_cliente
          await EntidadeClienteModel.create({ EntidadeId: Entidade.id, clientId: cliente.id });
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

          // Relacionar o usuário ao trabalhador na tabela Entidade_trabalhador
          await EntidadeTrabalhadorModel.create({ EntidadeId: Entidade.id, workerId: trabalhador.id });
        }
      }*/

      return reply.code(201).send({ success: true, data: Entidade });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ success: false, message: 'Validation error', errors: error.errors });
      }
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  // Novo endpoint para fazer upload da imagem e atualizar avatarUrl
  /*static async uploadAvatar(request: FastifyRequest<{ Body: { EntidadeId: number } }>, reply: FastifyReply) {
    try {
      const data = await request.file(); // Fastify-multipart deve estar configurado
      const EntidadeId = Number(request.body.EntidadeId.toString());

      if (!data) {
        return reply.code(400).send({ success: false, message: 'No image uploaded' });
      }

      // Upload no Cloudinary
      const buffer = await data.toBuffer();
      cloudinary.uploader.upload_stream(
        { folder: 'Entidades_avatars' },
        async (error, cloudinaryResponse) => {
          if (error || !cloudinaryResponse) {
            return reply.code(500).send({ success: false, message: 'Error uploading image', error: error?.message });
          }

          // Atualizar o avatarUrl do usuário dentro do callback
          await EntidadeModel.update(EntidadeId, { avatarUrl: cloudinaryResponse.secure_url });

          return reply.code(200).send({ success: true, avatarUrl: cloudinaryResponse.secure_url });
        }
      ).end(buffer);
    } catch (error) {
      return reply.code(500).send({ success: false, message: 'Error uploading image', error: (error as Error).message });
    }
  }*/

  static async show(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const Entidade = await EntidadeModel.findById(parseInt(request.params.id));
      if (!Entidade) {
        return reply.code(404).send({ success: false, message: 'Entidade not found' });
      }
      return reply.code(200).send({ success: true, data: Entidade });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  static async update(request: FastifyRequest<{ Params: { id: string }, Body: UpdateEntidadeInput }>, reply: FastifyReply) {
    try {
      const validatedData = UpdateEntidadeSchema.parse(request.body);
      const Entidade = await EntidadeModel.update(parseInt(request.params.id), validatedData);
      return reply.code(200).send({ success: true, data: Entidade });
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
      const Entidade = await EntidadeModel.restore(parseInt(request.params.id));
      return reply.code(200).send({ success: true , data: Entidade});
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
      const Entidades = await EntidadeModel.trash();
      return reply.code(200).send({ success: true, data: Entidades });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await EntidadeModel.delete(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'Entidade deleted successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async purge(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await EntidadeModel.purge(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'Entidade purged successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
}
