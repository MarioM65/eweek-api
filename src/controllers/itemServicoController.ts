import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateItemServicoSchema, UpdateItemServicoSchema, CreateItemServicoInput, UpdateItemServicoInput } from '../models/ItemServico';
import { ItemServicoModel } from '../models/ItemServico';
import { ZodError } from 'zod';

export class ItemServicoController {
  static async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const ItemServicos = await ItemServicoModel.findAll();
      return reply.code(200).send({ success: true, data: ItemServicos });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async create(request: FastifyRequest<{ Body: CreateItemServicoInput }>, reply: FastifyReply) {
    try {
      const validatedData = CreateItemServicoSchema.parse(request.body);
      const ItemServico = await ItemServicoModel.create(validatedData);

      // Criar uma carteira para o usuário (se for Cliente (3) ou Trabalhador(2))
    /*  if (validatedData.profileId === 3 || validatedData.profileId === 2) {
        const carteira = await CarteiraModel.create({ ItemServicoId: ItemServico.id, credits: 0 });

        if (validatedData.profileId === 2) {
          // Criar o cliente com o address e carteiraId
          const cliente = await ClienteModel.create({
            address: validatedData.address ?? "",
            walletId: carteira.id,
          });

          // Relacionar o usuário ao cliente na tabela ItemServico_cliente
          await ItemServicoClienteModel.create({ ItemServicoId: ItemServico.id, clientId: cliente.id });
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

          // Relacionar o usuário ao trabalhador na tabela ItemServico_trabalhador
          await ItemServicoTrabalhadorModel.create({ ItemServicoId: ItemServico.id, workerId: trabalhador.id });
        }
      }*/

      return reply.code(201).send({ success: true, data: ItemServico });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ success: false, message: 'Validation error', errors: error.errors });
      }
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  // Novo endpoint para fazer upload da imagem e atualizar avatarUrl
  /*static async uploadAvatar(request: FastifyRequest<{ Body: { ItemServicoId: number } }>, reply: FastifyReply) {
    try {
      const data = await request.file(); // Fastify-multipart deve estar configurado
      const ItemServicoId = Number(request.body.ItemServicoId.toString());

      if (!data) {
        return reply.code(400).send({ success: false, message: 'No image uploaded' });
      }

      // Upload no Cloudinary
      const buffer = await data.toBuffer();
      cloudinary.uploader.upload_stream(
        { folder: 'ItemServicos_avatars' },
        async (error, cloudinaryResponse) => {
          if (error || !cloudinaryResponse) {
            return reply.code(500).send({ success: false, message: 'Error uploading image', error: error?.message });
          }

          // Atualizar o avatarUrl do usuário dentro do callback
          await ItemServicoModel.update(ItemServicoId, { avatarUrl: cloudinaryResponse.secure_url });

          return reply.code(200).send({ success: true, avatarUrl: cloudinaryResponse.secure_url });
        }
      ).end(buffer);
    } catch (error) {
      return reply.code(500).send({ success: false, message: 'Error uploading image', error: (error as Error).message });
    }
  }*/

  static async show(request: FastifyRequest<{ Params: { itemId: string, servicoId: string } }>, reply: FastifyReply) {
    try {
      const ItemServico = await ItemServicoModel.findById(parseInt(request.params.itemId),parseInt(request.params.servicoId));
      if (!ItemServico) {
        return reply.code(404).send({ success: false, message: 'ItemServico not found' });
      }
      return reply.code(200).send({ success: true, data: ItemServico });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }


  static async restore(request: FastifyRequest<{ Params: { itemId: string, servicoId: string } }>, reply: FastifyReply) {
    try {
      const ItemServico = await ItemServicoModel.restore(parseInt(request.params.itemId),parseInt(request.params.servicoId));
      return reply.code(200).send({ success: true , data: ItemServico});
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
      const ItemServicos = await ItemServicoModel.trash();
      return reply.code(200).send({ success: true, data: ItemServicos });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async delete(request: FastifyRequest<{ Params: { itemId: string, servicoId: string }}>, reply: FastifyReply) {
    try {
      await ItemServicoModel.delete(parseInt(request.params.itemId),parseInt(request.params.servicoId));
      return reply.code(200).send({ success: true, message: 'ItemServico deleted successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async purge(request: FastifyRequest<{ Params: { itemId: string, servicoId: string }  }>, reply: FastifyReply) {
    try {
      await ItemServicoModel.purge(parseInt(request.params.itemId),parseInt(request.params.servicoId));
      return reply.code(200).send({ success: true, message: 'ItemServico purged successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
}
