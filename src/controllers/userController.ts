import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateUserSchema, UpdateUserSchema, CreateUserInput, UpdateUserInput } from '../models/User';
import { UserModel } from '../models/User';
import { ZodError } from 'zod';

export class UserController {
  static async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const users = await UserModel.findAll();
      return reply.code(200).send({ success: true, data: users });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async create(request: FastifyRequest<{ Body: CreateUserInput }>, reply: FastifyReply) {
    try {
      const validatedData = CreateUserSchema.parse(request.body);
      const user = await UserModel.create(validatedData);

      // Criar uma carteira para o usuário (se for Cliente (3) ou Trabalhador(2))
    /*  if (validatedData.profileId === 3 || validatedData.profileId === 2) {
        const carteira = await CarteiraModel.create({ userId: user.id, credits: 0 });

        if (validatedData.profileId === 2) {
          // Criar o cliente com o address e carteiraId
          const cliente = await ClienteModel.create({
            address: validatedData.address ?? "",
            walletId: carteira.id,
          });

          // Relacionar o usuário ao cliente na tabela user_cliente
          await UserClienteModel.create({ userId: user.id, clientId: cliente.id });
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

          // Relacionar o usuário ao trabalhador na tabela user_trabalhador
          await UserTrabalhadorModel.create({ userId: user.id, workerId: trabalhador.id });
        }
      }*/

      return reply.code(201).send({ success: true, data: user });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ success: false, message: 'Validation error', errors: error.errors });
      }
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  // Novo endpoint para fazer upload da imagem e atualizar avatarUrl
  /*static async uploadAvatar(request: FastifyRequest<{ Body: { userId: number } }>, reply: FastifyReply) {
    try {
      const data = await request.file(); // Fastify-multipart deve estar configurado
      const userId = Number(request.body.userId.toString());

      if (!data) {
        return reply.code(400).send({ success: false, message: 'No image uploaded' });
      }

      // Upload no Cloudinary
      const buffer = await data.toBuffer();
      cloudinary.uploader.upload_stream(
        { folder: 'users_avatars' },
        async (error, cloudinaryResponse) => {
          if (error || !cloudinaryResponse) {
            return reply.code(500).send({ success: false, message: 'Error uploading image', error: error?.message });
          }

          // Atualizar o avatarUrl do usuário dentro do callback
          await UserModel.update(userId, { avatarUrl: cloudinaryResponse.secure_url });

          return reply.code(200).send({ success: true, avatarUrl: cloudinaryResponse.secure_url });
        }
      ).end(buffer);
    } catch (error) {
      return reply.code(500).send({ success: false, message: 'Error uploading image', error: (error as Error).message });
    }
  }*/

  static async show(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const user = await UserModel.findById(parseInt(request.params.id));
      if (!user) {
        return reply.code(404).send({ success: false, message: 'User not found' });
      }
      return reply.code(200).send({ success: true, data: user });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async meus_dados(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const user = await UserModel.meus_dados(parseInt(request.params.id));
      if (!user) {
        return reply.code(404).send({ success: false, message: 'User not found' });
      }
      return reply.code(200).send({ success: true, data: user });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async update(request: FastifyRequest<{ Params: { id: string }, Body: UpdateUserInput }>, reply: FastifyReply) {
    try {
      const validatedData = UpdateUserSchema.parse(request.body);
      const user = await UserModel.update(parseInt(request.params.id), validatedData);
      return reply.code(200).send({ success: true, data: user });
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
      const user = await UserModel.restore(parseInt(request.params.id));
      return reply.code(200).send({ success: true , data: user});
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
      const users = await UserModel.trash();
      return reply.code(200).send({ success: true, data: users });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await UserModel.delete(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'User deleted successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async purge(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await UserModel.purge(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'User purged successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async checkEmail(request: FastifyRequest<{ Querystring: { vc_email: string } }>, reply: FastifyReply) {
    try {
      const { vc_email } = request.query;
      if (!vc_email) {
        return reply.code(400).send({ success: false, message: "Email is required" });
      }

      const exists = await UserModel.checkEmailExists(vc_email);
      return reply.send({ success: true, exists });
    } catch (error) {
      return reply.code(500).send({ success: false, message: "Internal server error", error: (error as Error).message });
    }
  }
}
