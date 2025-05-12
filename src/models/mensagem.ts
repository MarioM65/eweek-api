import { z } from 'zod';
import prisma from '../../plugins/prisma';

export const CreateMensagemSchema = z.object({
  conteudo: z.string().min(2),
    dataEnvio: z.date(),
  chatId: z.number(),
  userId: z.number(),
  respostaId: z.number().optional(),
});

export const UpdateMensagemSchema = CreateMensagemSchema.partial();

export type CreateMensagemInput = z.infer<typeof CreateMensagemSchema>;
export type UpdateMensagemInput = z.infer<typeof UpdateMensagemSchema>;

export class MensagemModel {
  static async create(data: CreateMensagemInput) {
    return prisma.mensagem.create({
      data,
      select: this.defaultSelect(),
    });
  }

  static async findAll() {
    return prisma.mensagem.findMany({
      where: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async findById(id: number) {
    return prisma.mensagem.findFirst({
      where: { id, deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async update(id: number, data: UpdateMensagemInput) {
    return prisma.mensagem.update({
      where: { id },
      data,
      select: this.defaultSelect(),
    });
  }

  static async delete(id: number) {
    return prisma.mensagem.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async restore(id: number) {
    return prisma.mensagem.update({
      where: { id },
      data: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async purge(id: number) {
    return prisma.mensagem.delete({
      where: { id },
    });
  }
  static async trash() {
    return prisma.mensagem.findMany({
      where: { deletedAt: { not: null } },
      select: this.defaultSelect(),
    });
  }
  private static defaultSelect() {
    return {
      id: true,
      conteudo: true,
      chatId: true,
      userId: true,
      respostaId: true,
     resposta: true,
      chat: true,
      user: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    };
  }
}
