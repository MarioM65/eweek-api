import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateServicoSchema, UpdateServicoSchema, CreateServicoInput, UpdateServicoInput } from '../models/Servico';
import { ServicoModel } from '../models/Servico';
import { ZodError } from 'zod';

export class ServicoController {
  static async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const Servicos = await ServicoModel.findAll();
      return reply.code(200).send({ success: true, data: Servicos });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async create(request: FastifyRequest<{ Body: CreateServicoInput }>, reply: FastifyReply) {
    try {
      const validatedData = CreateServicoSchema.parse(request.body);
      const Servico = await ServicoModel.create(validatedData);

      // Criar uma carteira para o usuário (se for Cliente (3) ou Trabalhador(2))
    /*  if (validatedData.profileId === 3 || validatedData.profileId === 2) {
        const carteira = await CarteiraModel.create({ ServicoId: Servico.id, credits: 0 });

        if (validatedData.profileId === 2) {
          // Criar o cliente com o address e carteiraId
          const cliente = await ClienteModel.create({
            address: validatedData.address ?? "",
            walletId: carteira.id,
          });

          // Relacionar o usuário ao cliente na tabela Servico_cliente
          await ServicoClienteModel.create({ ServicoId: Servico.id, clientId: cliente.id });
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

          // Relacionar o usuário ao trabalhador na tabela Servico_trabalhador
          await ServicoTrabalhadorModel.create({ ServicoId: Servico.id, workerId: trabalhador.id });
        }
      }*/

      return reply.code(201).send({ success: true, data: Servico });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ success: false, message: 'Validation error', errors: error.errors });
      }
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  // Novo endpoint para fazer upload da imagem e atualizar avatarUrl
  /*static async uploadAvatar(request: FastifyRequest<{ Body: { ServicoId: number } }>, reply: FastifyReply) {
    try {
      const data = await request.file(); // Fastify-multipart deve estar configurado
      const ServicoId = Number(request.body.ServicoId.toString());

      if (!data) {
        return reply.code(400).send({ success: false, message: 'No image uploaded' });
      }

      // Upload no Cloudinary
      const buffer = await data.toBuffer();
      cloudinary.uploader.upload_stream(
        { folder: 'Servicos_avatars' },
        async (error, cloudinaryResponse) => {
          if (error || !cloudinaryResponse) {
            return reply.code(500).send({ success: false, message: 'Error uploading image', error: error?.message });
          }

          // Atualizar o avatarUrl do usuário dentro do callback
          await ServicoModel.update(ServicoId, { avatarUrl: cloudinaryResponse.secure_url });

          return reply.code(200).send({ success: true, avatarUrl: cloudinaryResponse.secure_url });
        }
      ).end(buffer);
    } catch (error) {
      return reply.code(500).send({ success: false, message: 'Error uploading image', error: (error as Error).message });
    }
  }*/

  static async show(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      const Servico = await ServicoModel.findById(parseInt(request.params.id));
      if (!Servico) {
        return reply.code(404).send({ success: false, message: 'Servico not found' });
      }
      return reply.code(200).send({ success: true, data: Servico });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  static async update(request: FastifyRequest<{ Params: { id: string }, Body: UpdateServicoInput }>, reply: FastifyReply) {
    try {
      const validatedData = UpdateServicoSchema.parse(request.body);
      const Servico = await ServicoModel.update(parseInt(request.params.id), validatedData);
      return reply.code(200).send({ success: true, data: Servico });
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
      const Servico = await ServicoModel.restore(parseInt(request.params.id));
      return reply.code(200).send({ success: true , data: Servico});
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
      const Servicos = await ServicoModel.trash();
      return reply.code(200).send({ success: true, data: Servicos });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await ServicoModel.delete(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'Servico deleted successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async purge(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    try {
      await ServicoModel.purge(parseInt(request.params.id));
      return reply.code(200).send({ success: true, message: 'Servico purged successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
}
