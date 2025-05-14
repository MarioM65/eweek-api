import { z } from 'zod';
import prisma from '../../plugins/prisma';

export const CreateItemInfoSchema = z.object({
  txt_descricao: z.string().min(2).optional(),
  vc_nome: z.string().min(2).optional(),
  itemId: z.number(),
  userId: z.number(),
  seguroId: z.number(),
});

export const UpdateItemInfoSchema = CreateItemInfoSchema.partial();

export type CreateItemInfoInput = z.infer<typeof CreateItemInfoSchema>;
export type UpdateItemInfoInput = z.infer<typeof UpdateItemInfoSchema>;

export class ItemInfoModel {
  static async create(data: CreateItemInfoInput) {
    return prisma.itemInfo.create({
      data,
      select: this.defaultSelect(),
    });
  }

  static async findAll() {
    return prisma.itemInfo.findMany({
      where: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async findById(id: number) {
    return prisma.itemInfo.findFirst({
      where: { id, deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async update(id: number, data: UpdateItemInfoInput) {
    return prisma.itemInfo.update({
      where: { id },
      data,
      select: this.defaultSelect(),
    });
  }

  static async delete(id: number) {
    return prisma.itemInfo.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async restore(id: number) {
    return prisma.itemInfo.update({
      where: { id },
      data: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async purge(id: number) {
    return prisma.itemInfo.delete({
      where: { id },
    });
  }
  static async trash() {
    return prisma.itemInfo.findMany({
      where: { deletedAt: { not: null } },
      select: this.defaultSelect(),
    });
  }
  private static defaultSelect() {
    return {
      id: true,
      txt_descricao: true,
      vc_nome: true,
      itemId: true,
      userId: true,
      seguroId: true,
      info:true,
      veiculo:true,
      servicos:true,
       acidentes:true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    };
  }
}
