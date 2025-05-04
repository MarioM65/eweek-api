import { z } from 'zod';
import prisma from '../../plugins/prisma';

export const CreateServicoSchema = z.object({
  vc_nome: z.string().min(2),
  txt_descricao: z.string().min(2),
});

export const UpdateServicoSchema = CreateServicoSchema.partial();

export type CreateServicoInput = z.infer<typeof CreateServicoSchema>;
export type UpdateServicoInput = z.infer<typeof UpdateServicoSchema>;

export class ServicoModel {
  static async create(data: CreateServicoInput) {
    return prisma.Servico.create({
      data,
      select: this.defaultSelect(),
    });
  }

  static async findAll() {
    return prisma.Servico.findMany({
      where: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async findById(id: number) {
    return prisma.Servico.findFirst({
      where: { id, deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async update(id: number, data: UpdateServicoInput) {
    return prisma.Servico.update({
      where: { id },
      data,
      select: this.defaultSelect(),
    });
  }

  static async delete(id: number) {
    return prisma.Servico.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async trash() {
    return prisma.Servico.findMany({
      where: { deletedAt: { not: null } },
      select: this.defaultSelect(),
    });
  }
  static async restore(id: number) {
    return prisma.Servico.update({
      where: { id },
      data: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async purge(id: number) {
    return prisma.Servico.delete({
      where: { id },
    });
  }

  private static defaultSelect() {
    return {
      id: true,
      vc_nome: true,
      txt_descricao: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    };
  }
}
