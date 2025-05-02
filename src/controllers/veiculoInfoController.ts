import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateVeiculoInfoSchema, UpdateVeiculoInfoSchema, CreateVeiculoInfoInput, UpdateVeiculoInfoInput } from '../models/VeiculoInfo';
import { VeiculoInfoModel } from '../models/VeiculoInfo';
import { ZodError } from 'zod';

export class VeiculoInfoController {
  static async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const VeiculoInfos = await VeiculoInfoModel.findAll();
      return reply.code(200).send({ success: true, data: VeiculoInfos });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async create(request: FastifyRequest<{ Body: CreateVeiculoInfoInput }>, reply: FastifyReply) {
    try {
      const validatedData = CreateVeiculoInfoSchema.parse(request.body);
      const VeiculoInfo = await VeiculoInfoModel.create(validatedData);

      // Criar uma carteira para o usuário (se for Cliente (3) ou Trabalhador(2))
    /*  if (validatedData.profileId === 3 || validatedData.profileId === 2) {
        const carteira = await CarteiraModel.create({ VeiculoInfoId: VeiculoInfo.id, credits: 0 });

        if (validatedData.profileId === 2) {
          // Criar o cliente com o address e carteiraId
          const cliente = await ClienteModel.create({
            address: validatedData.address ?? "",
            walletId: carteira.id,
          });

          // Relacionar o usuário ao cliente na tabela VeiculoInfo_cliente
          await VeiculoInfoClienteModel.create({ VeiculoInfoId: VeiculoInfo.id, clientId: cliente.id });
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

          // Relacionar o usuário ao trabalhador na tabela VeiculoInfo_trabalhador
          await VeiculoInfoTrabalhadorModel.create({ VeiculoInfoId: VeiculoInfo.id, workerId: trabalhador.id });
        }
      }*/

      return reply.code(201).send({ success: true, data: VeiculoInfo });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ success: false, message: 'Validation error', errors: error.errors });
      }
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  // Novo endpoint para fazer upload da imagem e atualizar avatarUrl
  /*static async uploadAvatar(request: FastifyRequest<{ Body: { VeiculoInfoId: number } }>, reply: FastifyReply) {
    try {
      const data = await request.file(); // Fastify-multipart deve estar configurado
      const VeiculoInfoId = Number(request.body.VeiculoInfoId.toString());

      if (!data) {
        return reply.code(400).send({ success: false, message: 'No image uploaded' });
      }

      // Upload no Cloudinary
      const buffer = await data.toBuffer();
      cloudinary.uploader.upload_stream(
        { folder: 'VeiculoInfos_avatars' },
        async (error, cloudinaryResponse) => {
          if (error || !cloudinaryResponse) {
            return reply.code(500).send({ success: false, message: 'Error uploading image', error: error?.message });
          }

          // Atualizar o avatarUrl do usuário dentro do callback
          await VeiculoInfoModel.update(VeiculoInfoId, { avatarUrl: cloudinaryResponse.secure_url });

          return reply.code(200).send({ success: true, avatarUrl: cloudinaryResponse.secure_url });
        }
      ).end(buffer);
    } catch (error) {
      return reply.code(500).send({ success: false, message: 'Error uploading image', error: (error as Error).message });
    }
  }*/

  static async show(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const VeiculoInfo = await VeiculoInfoModel.findById(parseInt(request.params.id));
      if (!VeiculoInfo) {
        return reply.code(404).send({ success: false, message: 'VeiculoInfo not found' });
      }
      return reply.code(200).send({ success: true, data: VeiculoInfo });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  static async update(request: FastifyRequest<{ Params: { id: string }, Body: UpdateVeiculoInfoInput }>, reply: FastifyReply) {
    try {
      const validatedData = UpdateVeiculoInfoSchema.parse(request.body);
      const VeiculoInfo = await VeiculoInfoModel.update(parseInt(request.params.id), validatedData);
      return reply.code(200).send({ success: true, data: VeiculoInfo });
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
      const VeiculoInfo = await VeiculoInfoModel.restore(parseInt(request.params.id));
      return reply.code(200).send({ success: true , data: VeiculoInfo});
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
      const VeiculoInfos = await VeiculoInfoModel.trash();
      return reply.code(200).send({ success: true, data: VeiculoInfos });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await VeiculoInfoModel.delete(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'VeiculoInfo deleted successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async purge(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await VeiculoInfoModel.purge(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'VeiculoInfo purged successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
}
