import { z } from 'zod';
import prisma from '../../plugins/prisma';

export const CreateEntidadeSchema = z.object({
  vc_email: z.string().min(10),
  vc_telefone: z.string().min(2),
  filialId: z.number(),
  password: z.string().min(2),
});

export const UpdateEntidadeSchema = CreateEntidadeSchema.partial();

export type CreateEntidadeInput = z.infer<typeof CreateEntidadeSchema>;
export type UpdateEntidadeInput = z.infer<typeof UpdateEntidadeSchema>;

export class EntidadeModel {
  static async create(data: CreateEntidadeInput) {
    return prisma.entidade.create({
      data,
      select: this.defaultSelect(),
    });
  }

  static async findAll() {
    return prisma.entidade.findMany({
      where: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async findById(id: number) {
    return prisma.entidade.findFirst({
      where: { id, deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async update(id: number, data: UpdateEntidadeInput) {
    return prisma.entidade.update({
      where: { id },
      data,
      select: this.defaultSelect(),
    });
  }

  static async delete(id: number) {
    return prisma.entidade.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async restore(id: number) {
    return prisma.entidade.update({
      where: { id },
      data: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async purge(id: number) {
    return prisma.entidade.delete({
      where: { id },
    });
  }
  static async trash() {
    return prisma.entidade.findMany({
      where: { deletedAt: { not: null } },
      select: this.defaultSelect(),
    });
  }
  private static defaultSelect() {
    return {
      id: true,
      vc_email: true,
      vc_telefone: true,
      password: true,
      filialId: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    };
  }
}
