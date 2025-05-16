import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateAcidenteSchema, UpdateAcidenteSchema, CreateAcidenteInput, UpdateAcidenteInput } from '../models/Acidente';
import { AcidenteModel } from '../models/Acidente';
import { ZodError } from 'zod';

export class AcidenteController {
  static async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const Acidentes = await AcidenteModel.findAll();
      return reply.code(200).send({ success: true, data: Acidentes });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async create(request: FastifyRequest<{ Body: CreateAcidenteInput }>, reply: FastifyReply) {
    try {
      const validatedData = CreateAcidenteSchema.parse(request.body);
      const Acidente = await AcidenteModel.create(validatedData);

      // Criar uma carteira para o usuário (se for Cliente (3) ou Trabalhador(2))
    /*  if (validatedData.profileId === 3 || validatedData.profileId === 2) {
        const carteira = await CarteiraModel.create({ AcidenteId: Acidente.id, credits: 0 });

        if (validatedData.profileId === 2) {
          // Criar o cliente com o address e carteiraId
          const cliente = await ClienteModel.create({
            address: validatedData.address ?? "",
            walletId: carteira.id,
          });

          // Relacionar o usuário ao cliente na tabela Acidente_cliente
          await AcidenteClienteModel.create({ AcidenteId: Acidente.id, clientId: cliente.id });
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

          // Relacionar o usuário ao trabalhador na tabela Acidente_trabalhador
          await AcidenteTrabalhadorModel.create({ AcidenteId: Acidente.id, workerId: trabalhador.id });
        }
      }*/

      return reply.code(201).send({ success: true, data: Acidente });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ success: false, message: 'Validation error', errors: error.errors });
      }
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  // Novo endpoint para fazer upload da imagem e atualizar avatarUrl
  /*static async uploadAvatar(request: FastifyRequest<{ Body: { AcidenteId: number } }>, reply: FastifyReply) {
    try {
      const data = await request.file(); // Fastify-multipart deve estar configurado
      const AcidenteId = Number(request.body.AcidenteId.toString());

      if (!data) {
        return reply.code(400).send({ success: false, message: 'No image uploaded' });
      }

      // Upload no Cloudinary
      const buffer = await data.toBuffer();
      cloudinary.uploader.upload_stream(
        { folder: 'Acidentes_avatars' },
        async (error, cloudinaryResponse) => {
          if (error || !cloudinaryResponse) {
            return reply.code(500).send({ success: false, message: 'Error uploading image', error: error?.message });
          }

          // Atualizar o avatarUrl do usuário dentro do callback
          await AcidenteModel.update(AcidenteId, { avatarUrl: cloudinaryResponse.secure_url });

          return reply.code(200).send({ success: true, avatarUrl: cloudinaryResponse.secure_url });
        }
      ).end(buffer);
    } catch (error) {
      return reply.code(500).send({ success: false, message: 'Error uploading image', error: (error as Error).message });
    }
  }*/

  static async show(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const Acidente = await AcidenteModel.findById(parseInt(request.params.id));
      if (!Acidente) {
        return reply.code(404).send({ success: false, message: 'Acidente not found' });
      }
      return reply.code(200).send({ success: true, data: Acidente });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
    static async check(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const Acidente = await AcidenteModel.check(parseInt(request.params.id));
      return reply.code(200).send({ success: true, data: Acidente });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  static async update(request: FastifyRequest<{ Params: { id: string }, Body: UpdateAcidenteInput }>, reply: FastifyReply) {
    try {
      const validatedData = UpdateAcidenteSchema.parse(request.body);
      const Acidente = await AcidenteModel.update(parseInt(request.params.id), validatedData);
      return reply.code(200).send({ success: true, data: Acidente });
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
      const Acidente = await AcidenteModel.restore(parseInt(request.params.id));
      return reply.code(200).send({ success: true , data: Acidente});
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
      const Acidentes = await AcidenteModel.trash();
      return reply.code(200).send({ success: true, data: Acidentes });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
   static async fake(request: FastifyRequest, reply: FastifyReply) {
    try {
      const Acidentes = await AcidenteModel.fake();
      return reply.code(200).send({ success: true, data: Acidentes });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await AcidenteModel.delete(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'Acidente deleted successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async purge(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await AcidenteModel.purge(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'Acidente purged successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
}
