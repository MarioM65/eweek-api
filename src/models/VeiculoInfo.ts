import { z } from 'zod';
import prisma from '../../plugins/prisma';

export const CreateVeiculoInfoSchema = z.object({
  vc_matricula: z.string().min(2),
  modelo: z.string().min(2),
  itemId: z.number(),
  userId: z.number(),
  seguroId: z.number(),
});

export const UpdateVeiculoInfoSchema = CreateVeiculoInfoSchema.partial();

export type CreateVeiculoInfoInput = z.infer<typeof CreateVeiculoInfoSchema>;
export type UpdateVeiculoInfoInput = z.infer<typeof UpdateVeiculoInfoSchema>;

export class VeiculoInfoModel {
  static async create(data: CreateVeiculoInfoInput) {
    return prisma.veiculoInfo.create({
      data,
      select: this.defaultSelect(),
    });
  }

  static async findAll() {
    return prisma.veiculoInfo.findMany({
      where: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async findById(id: number) {
    return prisma.veiculoInfo.findFirst({
      where: { id, deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async update(id: number, data: UpdateVeiculoInfoInput) {
    return prisma.veiculoInfo.update({
      where: { id },
      data,
      select: this.defaultSelect(),
    });
  }

  static async delete(id: number) {
    return prisma.veiculoInfo.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async restore(id: number) {
    return prisma.veiculoInfo.update({
      where: { id },
      data: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async purge(id: number) {
    return prisma.veiculoInfo.delete({
      where: { id },
    });
  }
  static async trash() {
    return prisma.veiculoInfo.findMany({
      where: { deletedAt: { not: null } },
      select: this.defaultSelect(),
    });
  }
  private static defaultSelect() {
    return {
      id: true,
      vc_matricula: true,
      modelo: true,
      itemId: true,
      userId: true,
      seguroId: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    };
  }
}
