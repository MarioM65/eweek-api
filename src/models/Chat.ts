import { z } from 'zod';
import prisma from '../../plugins/prisma';

export const CreateChatSchema = z.object({
  nome: z.string().min(10),
  criadoPor: z.number(),
});

export const UpdateChatSchema = CreateChatSchema.partial();

export type CreateChatInput = z.infer<typeof CreateChatSchema>;
export type UpdateChatInput = z.infer<typeof UpdateChatSchema>;

export class ChatModel {
  static async create(data: CreateChatInput) {
    return prisma.chat.create({
      data,
      select: this.defaultSelect(),
    });
  }

  static async findAll() {
    return prisma.chat.findMany({
      where: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async findById(id: number) {
    return prisma.chat.findFirst({
      where: { id, deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async update(id: number, data: UpdateChatInput) {
    return prisma.chat.update({
      where: { id },
      data,
      select: this.defaultSelect(),
    });
  }

  static async delete(id: number) {
    return prisma.chat.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async restore(id: number) {
    return prisma.chat.update({
      where: { id },
      data: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async purge(id: number) {
    return prisma.chat.delete({
      where: { id },
    });
  }
  static async trash() {
    return prisma.chat.findMany({
      where: { deletedAt: { not: null } },
      select: this.defaultSelect(),
    });
  }
  private static defaultSelect() {
    return {
      id: true,
      nome: true,
      criadoPor: true,
      usuarios:true,
      mensagens:true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    };
  }
}
