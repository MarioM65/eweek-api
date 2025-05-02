import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateUserSeguradoraSchema, UpdateUserSeguradoraSchema, CreateUserSeguradoraInput, UpdateUserSeguradoraInput } from '../models/UserSeguradora';
import { UserSeguradoraModel } from '../models/UserSeguradora';
import { ZodError } from 'zod';

export class UserSeguradoraController {
  static async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userSeguradoras = await UserSeguradoraModel.findAll();
      return reply.code(200).send({ success: true, data: userSeguradoras });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async create(request: FastifyRequest<{ Body: CreateUserSeguradoraInput }>, reply: FastifyReply) {
    try {
      const validatedData = CreateUserSeguradoraSchema.parse(request.body);
      const userSeguradora = await UserSeguradoraModel.create(validatedData);

      // Criar uma carteira para o usuário (se for Cliente (3) ou Trabalhador(2))
    /*  if (validatedData.profileId === 3 || validatedData.profileId === 2) {
        const carteira = await CarteiraModel.create({ userSeguradoraId: userSeguradora.id, credits: 0 });

        if (validatedData.profileId === 2) {
          // Criar o cliente com o address e carteiraId
          const cliente = await ClienteModel.create({
            address: validatedData.address ?? "",
            walletId: carteira.id,
          });

          // Relacionar o usuário ao cliente na tabela userSeguradora_cliente
          await UserSeguradoraClienteModel.create({ userSeguradoraId: userSeguradora.id, clientId: cliente.id });
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

          // Relacionar o usuário ao trabalhador na tabela userSeguradora_trabalhador
          await UserSeguradoraTrabalhadorModel.create({ userSeguradoraId: userSeguradora.id, workerId: trabalhador.id });
        }
      }*/

      return reply.code(201).send({ success: true, data: userSeguradora });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ success: false, message: 'Validation error', errors: error.errors });
      }
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  // Novo endpoint para fazer upload da imagem e atualizar avatarUrl
  /*static async uploadAvatar(request: FastifyRequest<{ Body: { userSeguradoraId: number } }>, reply: FastifyReply) {
    try {
      const data = await request.file(); // Fastify-multipart deve estar configurado
      const userSeguradoraId = Number(request.body.userSeguradoraId.toString());

      if (!data) {
        return reply.code(400).send({ success: false, message: 'No image uploaded' });
      }

      // Upload no Cloudinary
      const buffer = await data.toBuffer();
      cloudinary.uploader.upload_stream(
        { folder: 'userSeguradoras_avatars' },
        async (error, cloudinaryResponse) => {
          if (error || !cloudinaryResponse) {
            return reply.code(500).send({ success: false, message: 'Error uploading image', error: error?.message });
          }

          // Atualizar o avatarUrl do usuário dentro do callback
          await UserSeguradoraModel.update(userSeguradoraId, { avatarUrl: cloudinaryResponse.secure_url });

          return reply.code(200).send({ success: true, avatarUrl: cloudinaryResponse.secure_url });
        }
      ).end(buffer);
    } catch (error) {
      return reply.code(500).send({ success: false, message: 'Error uploading image', error: (error as Error).message });
    }
  }*/

  static async show(request: FastifyRequest<{ Params: { userId: string, seguradoraId: string } }>, reply: FastifyReply) {
    try {
      const userSeguradora = await UserSeguradoraModel.findById(parseInt(request.params.userId),parseInt(request.params.seguradoraId));
      if (!userSeguradora) {
        return reply.code(404).send({ success: false, message: 'UserSeguradora not found' });
      }
      return reply.code(200).send({ success: true, data: userSeguradora });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }


  static async restore(request: FastifyRequest<{ Params: { userId: string, seguradoraId: string } }>, reply: FastifyReply) {
    try {
      const userSeguradora = await UserSeguradoraModel.restore(parseInt(request.params.userId),parseInt(request.params.seguradoraId));
      return reply.code(200).send({ success: true , data: userSeguradora});
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
      const userSeguradoras = await UserSeguradoraModel.trash();
      return reply.code(200).send({ success: true, data: userSeguradoras });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async delete(request: FastifyRequest<{ Params: { userId: string, seguradoraId: string }}>, reply: FastifyReply) {
    try {
      await UserSeguradoraModel.delete(parseInt(request.params.userId),parseInt(request.params.seguradoraId));
      return reply.code(200).send({ success: true, message: 'UserSeguradora deleted successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async purge(request: FastifyRequest<{ Params: { userId: string, seguradoraId: string }  }>, reply: FastifyReply) {
    try {
      await UserSeguradoraModel.purge(parseInt(request.params.userId),parseInt(request.params.seguradoraId));
      return reply.code(200).send({ success: true, message: 'UserSeguradora purged successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
}
