import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateItemInfoSchema, UpdateItemInfoSchema, CreateItemInfoInput, UpdateItemInfoInput } from '../models/ItemInfo';
import { ItemInfoModel } from '../models/ItemInfo';
import { ZodError } from 'zod';

export class ItemInfoController {
  static async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const ItemInfos = await ItemInfoModel.findAll();
      return reply.code(200).send({ success: true, data: ItemInfos });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async create(request: FastifyRequest<{ Body: CreateItemInfoInput }>, reply: FastifyReply) {
    try {
      const validatedData = CreateItemInfoSchema.parse(request.body);
      const ItemInfo = await ItemInfoModel.create(validatedData);

      // Criar uma carteira para o usuário (se for Cliente (3) ou Trabalhador(2))
    /*  if (validatedData.profileId === 3 || validatedData.profileId === 2) {
        const carteira = await CarteiraModel.create({ ItemInfoId: ItemInfo.id, credits: 0 });

        if (validatedData.profileId === 2) {
          // Criar o cliente com o address e carteiraId
          const cliente = await ClienteModel.create({
            address: validatedData.address ?? "",
            walletId: carteira.id,
          });

          // Relacionar o usuário ao cliente na tabela ItemInfo_cliente
          await ItemInfoClienteModel.create({ ItemInfoId: ItemInfo.id, clientId: cliente.id });
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

          // Relacionar o usuário ao trabalhador na tabela ItemInfo_trabalhador
          await ItemInfoTrabalhadorModel.create({ ItemInfoId: ItemInfo.id, workerId: trabalhador.id });
        }
      }*/

      return reply.code(201).send({ success: true, data: ItemInfo });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ success: false, message: 'Validation error', errors: error.errors });
      }
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  // Novo endpoint para fazer upload da imagem e atualizar avatarUrl
  /*static async uploadAvatar(request: FastifyRequest<{ Body: { ItemInfoId: number } }>, reply: FastifyReply) {
    try {
      const data = await request.file(); // Fastify-multipart deve estar configurado
      const ItemInfoId = Number(request.body.ItemInfoId.toString());

      if (!data) {
        return reply.code(400).send({ success: false, message: 'No image uploaded' });
      }

      // Upload no Cloudinary
      const buffer = await data.toBuffer();
      cloudinary.uploader.upload_stream(
        { folder: 'ItemInfos_avatars' },
        async (error, cloudinaryResponse) => {
          if (error || !cloudinaryResponse) {
            return reply.code(500).send({ success: false, message: 'Error uploading image', error: error?.message });
          }

          // Atualizar o avatarUrl do usuário dentro do callback
          await ItemInfoModel.update(ItemInfoId, { avatarUrl: cloudinaryResponse.secure_url });

          return reply.code(200).send({ success: true, avatarUrl: cloudinaryResponse.secure_url });
        }
      ).end(buffer);
    } catch (error) {
      return reply.code(500).send({ success: false, message: 'Error uploading image', error: (error as Error).message });
    }
  }*/

  static async show(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const ItemInfo = await ItemInfoModel.findById(parseInt(request.params.id));
      if (!ItemInfo) {
        return reply.code(404).send({ success: false, message: 'ItemInfo not found' });
      }
      return reply.code(200).send({ success: true, data: ItemInfo });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  static async update(request: FastifyRequest<{ Params: { id: string }, Body: UpdateItemInfoInput }>, reply: FastifyReply) {
    try {
      const validatedData = UpdateItemInfoSchema.parse(request.body);
      const ItemInfo = await ItemInfoModel.update(parseInt(request.params.id), validatedData);
      return reply.code(200).send({ success: true, data: ItemInfo });
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
      const ItemInfo = await ItemInfoModel.restore(parseInt(request.params.id));
      return reply.code(200).send({ success: true , data: ItemInfo});
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
      const ItemInfos = await ItemInfoModel.trash();
      return reply.code(200).send({ success: true, data: ItemInfos });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await ItemInfoModel.delete(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'ItemInfo deleted successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async purge(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await ItemInfoModel.purge(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'ItemInfo purged successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
}
