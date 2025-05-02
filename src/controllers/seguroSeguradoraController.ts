import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateSeguroSeguradoraSchema, UpdateSeguroSeguradoraSchema, CreateSeguroSeguradoraInput, UpdateSeguroSeguradoraInput } from '../models/SeguroSeguradora';
import { SeguroSeguradoraModel } from '../models/SeguroSeguradora';
import { ZodError } from 'zod';

export class SeguroSeguradoraController {
  static async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const SeguroSeguradoras = await SeguroSeguradoraModel.findAll();
      return reply.code(200).send({ success: true, data: SeguroSeguradoras });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async create(request: FastifyRequest<{ Body: CreateSeguroSeguradoraInput }>, reply: FastifyReply) {
    try {
      const validatedData = CreateSeguroSeguradoraSchema.parse(request.body);
      const SeguroSeguradora = await SeguroSeguradoraModel.create(validatedData);

      // Criar uma carteira para o usuário (se for Cliente (3) ou Trabalhador(2))
    /*  if (validatedData.profileId === 3 || validatedData.profileId === 2) {
        const carteira = await CarteiraModel.create({ SeguroSeguradoraId: SeguroSeguradora.id, credits: 0 });

        if (validatedData.profileId === 2) {
          // Criar o cliente com o address e carteiraId
          const cliente = await ClienteModel.create({
            address: validatedData.address ?? "",
            walletId: carteira.id,
          });

          // Relacionar o usuário ao cliente na tabela SeguroSeguradora_cliente
          await SeguroSeguradoraClienteModel.create({ SeguroSeguradoraId: SeguroSeguradora.id, clientId: cliente.id });
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

          // Relacionar o usuário ao trabalhador na tabela SeguroSeguradora_trabalhador
          await SeguroSeguradoraTrabalhadorModel.create({ SeguroSeguradoraId: SeguroSeguradora.id, workerId: trabalhador.id });
        }
      }*/

      return reply.code(201).send({ success: true, data: SeguroSeguradora });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ success: false, message: 'Validation error', errors: error.errors });
      }
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  // Novo endpoint para fazer upload da imagem e atualizar avatarUrl
  /*static async uploadAvatar(request: FastifyRequest<{ Body: { SeguroSeguradoraId: number } }>, reply: FastifyReply) {
    try {
      const data = await request.file(); // Fastify-multipart deve estar configurado
      const SeguroSeguradoraId = Number(request.body.SeguroSeguradoraId.toString());

      if (!data) {
        return reply.code(400).send({ success: false, message: 'No image uploaded' });
      }

      // Upload no Cloudinary
      const buffer = await data.toBuffer();
      cloudinary.uploader.upload_stream(
        { folder: 'SeguroSeguradoras_avatars' },
        async (error, cloudinaryResponse) => {
          if (error || !cloudinaryResponse) {
            return reply.code(500).send({ success: false, message: 'Error uploading image', error: error?.message });
          }

          // Atualizar o avatarUrl do usuário dentro do callback
          await SeguroSeguradoraModel.update(SeguroSeguradoraId, { avatarUrl: cloudinaryResponse.secure_url });

          return reply.code(200).send({ success: true, avatarUrl: cloudinaryResponse.secure_url });
        }
      ).end(buffer);
    } catch (error) {
      return reply.code(500).send({ success: false, message: 'Error uploading image', error: (error as Error).message });
    }
  }*/

  static async show(request: FastifyRequest<{ Params: { seguroId: string, seguradoraId: string } }>, reply: FastifyReply) {
    try {
      const SeguroSeguradora = await SeguroSeguradoraModel.findById(parseInt(request.params.seguroId),parseInt(request.params.seguradoraId));
      if (!SeguroSeguradora) {
        return reply.code(404).send({ success: false, message: 'SeguroSeguradora not found' });
      }
      return reply.code(200).send({ success: true, data: SeguroSeguradora });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }


  static async restore(request: FastifyRequest<{ Params: { seguroId: string, seguradoraId: string } }>, reply: FastifyReply) {
    try {
      const SeguroSeguradora = await SeguroSeguradoraModel.restore(parseInt(request.params.seguroId),parseInt(request.params.seguradoraId));
      return reply.code(200).send({ success: true , data: SeguroSeguradora});
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
      const SeguroSeguradoras = await SeguroSeguradoraModel.trash();
      return reply.code(200).send({ success: true, data: SeguroSeguradoras });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async delete(request: FastifyRequest<{ Params: { seguroId: string, seguradoraId: string }}>, reply: FastifyReply) {
    try {
      await SeguroSeguradoraModel.delete(parseInt(request.params.seguroId),parseInt(request.params.seguradoraId));
      return reply.code(200).send({ success: true, message: 'SeguroSeguradora deleted successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async purge(request: FastifyRequest<{ Params: { seguroId: string, seguradoraId: string }  }>, reply: FastifyReply) {
    try {
      await SeguroSeguradoraModel.purge(parseInt(request.params.seguroId),parseInt(request.params.seguradoraId));
      return reply.code(200).send({ success: true, message: 'SeguroSeguradora purged successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
}
