import { FastifyRequest, FastifyReply } from 'fastify';
import { CreateSeguroServicoSchema, UpdateSeguroServicoSchema, CreateSeguroServicoInput, UpdateSeguroServicoInput } from '../models/SeguroServico';
import { SeguroServicoModel } from '../models/SeguroServico';
import { ZodError } from 'zod';

export class SeguroServicoController {
  static async index(request: FastifyRequest, reply: FastifyReply) {
    try {
      const SeguroServicos = await SeguroServicoModel.findAll();
      return reply.code(200).send({ success: true, data: SeguroServicos });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async create(request: FastifyRequest<{ Body: CreateSeguroServicoInput }>, reply: FastifyReply) {
    try {
      const validatedData = CreateSeguroServicoSchema.parse(request.body);
      const SeguroServico = await SeguroServicoModel.create(validatedData);

      // Criar uma carteira para o usuário (se for Cliente (3) ou Trabalhador(2))
    /*  if (validatedData.profileId === 3 || validatedData.profileId === 2) {
        const carteira = await CarteiraModel.create({ SeguroServicoId: SeguroServico.id, credits: 0 });

        if (validatedData.profileId === 2) {
          // Criar o cliente com o address e carteiraId
          const cliente = await ClienteModel.create({
            address: validatedData.address ?? "",
            walletId: carteira.id,
          });

          // Relacionar o usuário ao cliente na tabela SeguroServico_cliente
          await SeguroServicoClienteModel.create({ SeguroServicoId: SeguroServico.id, clientId: cliente.id });
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

          // Relacionar o usuário ao trabalhador na tabela SeguroServico_trabalhador
          await SeguroServicoTrabalhadorModel.create({ SeguroServicoId: SeguroServico.id, workerId: trabalhador.id });
        }
      }*/

      return reply.code(201).send({ success: true, data: SeguroServico });
    } catch (error) {
      if (error instanceof ZodError) {
        return reply.code(400).send({ success: false, message: 'Validation error', errors: error.errors });
      }
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }

  // Novo endpoint para fazer upload da imagem e atualizar avatarUrl
  /*static async uploadAvatar(request: FastifyRequest<{ Body: { SeguroServicoId: number } }>, reply: FastifyReply) {
    try {
      const data = await request.file(); // Fastify-multipart deve estar configurado
      const SeguroServicoId = Number(request.body.SeguroServicoId.toString());

      if (!data) {
        return reply.code(400).send({ success: false, message: 'No image uploaded' });
      }

      // Upload no Cloudinary
      const buffer = await data.toBuffer();
      cloudinary.uploader.upload_stream(
        { folder: 'SeguroServicos_avatars' },
        async (error, cloudinaryResponse) => {
          if (error || !cloudinaryResponse) {
            return reply.code(500).send({ success: false, message: 'Error uploading image', error: error?.message });
          }

          // Atualizar o avatarUrl do usuário dentro do callback
          await SeguroServicoModel.update(SeguroServicoId, { avatarUrl: cloudinaryResponse.secure_url });

          return reply.code(200).send({ success: true, avatarUrl: cloudinaryResponse.secure_url });
        }
      ).end(buffer);
    } catch (error) {
      return reply.code(500).send({ success: false, message: 'Error uploading image', error: (error as Error).message });
    }
  }*/

  static async show(request: FastifyRequest<{ Params: { seguroId: string, servicoId: string } }>, reply: FastifyReply) {
    try {
      const SeguroServico = await SeguroServicoModel.findById(parseInt(request.params.seguroId),parseInt(request.params.servicoId));
      if (!SeguroServico) {
        return reply.code(404).send({ success: false, message: 'SeguroServico not found' });
      }
      return reply.code(200).send({ success: true, data: SeguroServico });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }


  static async restore(request: FastifyRequest<{ Params: { seguroId: string, servicoId: string } }>, reply: FastifyReply) {
    try {
      const SeguroServico = await SeguroServicoModel.restore(parseInt(request.params.seguroId),parseInt(request.params.servicoId));
      return reply.code(200).send({ success: true , data: SeguroServico});
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
      const SeguroServicos = await SeguroServicoModel.trash();
      return reply.code(200).send({ success: true, data: SeguroServicos });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async delete(request: FastifyRequest<{ Params: { seguroId: string, servicoId: string }}>, reply: FastifyReply) {
    try {
      await SeguroServicoModel.delete(parseInt(request.params.seguroId),parseInt(request.params.servicoId));
      return reply.code(200).send({ success: true, message: 'SeguroServico deleted successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
  static async purge(request: FastifyRequest<{ Params: { seguroId: string, servicoId: string }  }>, reply: FastifyReply) {
    try {
      await SeguroServicoModel.purge(parseInt(request.params.seguroId),parseInt(request.params.servicoId));
      return reply.code(200).send({ success: true, message: 'SeguroServico purged successfully' });
    } catch (error) {
      const err = error as Error;
      return reply.code(500).send({ success: false, message: 'Internal server error', error: err.message || 'Unknown error' });
    }
  }
}
