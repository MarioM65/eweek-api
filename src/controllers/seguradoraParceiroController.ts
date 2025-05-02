import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateSeguradoraParceiroSchema, UpdateSeguradoraParceiroSchema, CreateSeguradoraParceiroInput, UpdateSeguradoraParceiroInput } from '../models/SeguradoraParceiro';
import { SeguradoraParceiroModel } from '../models/SeguradoraParceiro';
import { ZodError } from 'zod';

export class SeguradoraParceiroController {
  static async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const SeguradoraParceiros = await SeguradoraParceiroModel.findAll();
      return reply.code(200).send({ success: true, data: SeguradoraParceiros });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async create(request: FastifyRequest<{ Body: CreateSeguradoraParceiroInput }>, reply: FastifyReply) {
    try {
      const validatedData = CreateSeguradoraParceiroSchema.parse(request.body);
      const SeguradoraParceiro = await SeguradoraParceiroModel.create(validatedData);

      // Criar uma carteira para o usuário (se for Cliente (3) ou Trabalhador(2))
    /*  if (validatedData.profileId === 3 || validatedData.profileId === 2) {
        const carteira = await CarteiraModel.create({ SeguradoraParceiroId: SeguradoraParceiro.id, credits: 0 });

        if (validatedData.profileId === 2) {
          // Criar o cliente com o address e carteiraId
          const cliente = await ClienteModel.create({
            address: validatedData.address ?? "",
            walletId: carteira.id,
          });

          // Relacionar o usuário ao cliente na tabela SeguradoraParceiro_cliente
          await SeguradoraParceiroClienteModel.create({ SeguradoraParceiroId: SeguradoraParceiro.id, clientId: cliente.id });
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

          // Relacionar o usuário ao trabalhador na tabela SeguradoraParceiro_trabalhador
          await SeguradoraParceiroTrabalhadorModel.create({ SeguradoraParceiroId: SeguradoraParceiro.id, workerId: trabalhador.id });
        }
      }*/

      return reply.code(201).send({ success: true, data: SeguradoraParceiro });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ success: false, message: 'Validation error', errors: error.errors });
      }
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  // Novo endpoint para fazer upload da imagem e atualizar avatarUrl
  /*static async uploadAvatar(request: FastifyRequest<{ Body: { SeguradoraParceiroId: number } }>, reply: FastifyReply) {
    try {
      const data = await request.file(); // Fastify-multipart deve estar configurado
      const SeguradoraParceiroId = Number(request.body.SeguradoraParceiroId.toString());

      if (!data) {
        return reply.code(400).send({ success: false, message: 'No image uploaded' });
      }

      // Upload no Cloudinary
      const buffer = await data.toBuffer();
      cloudinary.uploader.upload_stream(
        { folder: 'SeguradoraParceiros_avatars' },
        async (error, cloudinaryResponse) => {
          if (error || !cloudinaryResponse) {
            return reply.code(500).send({ success: false, message: 'Error uploading image', error: error?.message });
          }

          // Atualizar o avatarUrl do usuário dentro do callback
          await SeguradoraParceiroModel.update(SeguradoraParceiroId, { avatarUrl: cloudinaryResponse.secure_url });

          return reply.code(200).send({ success: true, avatarUrl: cloudinaryResponse.secure_url });
        }
      ).end(buffer);
    } catch (error) {
      return reply.code(500).send({ success: false, message: 'Error uploading image', error: (error as Error).message });
    }
  }*/

  static async show(request: FastifyRequest<{ Params: { parceiroId: string, seguradoraId: string } }>, reply: FastifyReply) {
    try {
      const SeguradoraParceiro = await SeguradoraParceiroModel.findById(parseInt(request.params.parceiroId),parseInt(request.params.seguradoraId));
      if (!SeguradoraParceiro) {
        return reply.code(404).send({ success: false, message: 'SeguradoraParceiro not found' });
      }
      return reply.code(200).send({ success: true, data: SeguradoraParceiro });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }


  static async restore(request: FastifyRequest<{ Params: { parceiroId: string, seguradoraId: string } }>, reply: FastifyReply) {
    try {
      const SeguradoraParceiro = await SeguradoraParceiroModel.restore(parseInt(request.params.parceiroId),parseInt(request.params.seguradoraId));
      return reply.code(200).send({ success: true , data: SeguradoraParceiro});
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
      const SeguradoraParceiros = await SeguradoraParceiroModel.trash();
      return reply.code(200).send({ success: true, data: SeguradoraParceiros });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async delete(request: FastifyRequest<{ Params: { parceiroId: string, seguradoraId: string }}>, reply: FastifyReply) {
    try {
      await SeguradoraParceiroModel.delete(parseInt(request.params.parceiroId),parseInt(request.params.seguradoraId));
      return reply.code(200).send({ success: true, message: 'SeguradoraParceiro deleted successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async purge(request: FastifyRequest<{ Params: { parceiroId: string, seguradoraId: string }  }>, reply: FastifyReply) {
    try {
      await SeguradoraParceiroModel.purge(parseInt(request.params.parceiroId),parseInt(request.params.seguradoraId));
      return reply.code(200).send({ success: true, message: 'SeguradoraParceiro purged successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
}
