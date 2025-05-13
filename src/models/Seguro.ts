import { z } from 'zod';
import prisma from '../../plugins/prisma';

export const CreateSeguroSchema = z.object({
  vc_nome: z.string().min(2),
  fl_preco: z.number().positive(),
  txt_descricao: z.string().min(2),
});

export const UpdateSeguroSchema = CreateSeguroSchema.partial();

export type CreateSeguroInput = z.infer<typeof CreateSeguroSchema>;
export type UpdateSeguroInput = z.infer<typeof UpdateSeguroSchema>;

export class SeguroModel {
  static async create(data: CreateSeguroInput) {
    return prisma.seguro.create({
      data,
      select: this.defaultSelect(),
    });
  }

  static async findAll() {
    return prisma.seguro.findMany({
      where: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async findById(id: number) {
    return prisma.seguro.findFirst({
      where: { id, deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async update(id: number, data: UpdateSeguroInput) {
    return prisma.seguro.update({
      where: { id },
      data,
      select: this.defaultSelect(),
    });
  }

  static async delete(id: number) {
    return prisma.seguro.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async trash() {
    return prisma.seguro.findMany({
      where: { deletedAt: { not: null } },
      select: this.defaultSelect(),
    });
  }
  static async restore(id: number) {
    return prisma.seguro.update({
      where: { id },
      data: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async purge(id: number) {
    return prisma.seguro.delete({
      where: { id },
    });
  }

  private static defaultSelect() {
    return {
      id: true,
      vc_nome: true,
      fl_preco: true,
      txt_descricao: true,
      createdAt: true,
       usuarios:true,
       seguradoras:true,
       servicos:true,
        veiculos:true,
       tems:true,
       apolices:true,
      updatedAt: true,
      deletedAt: true,
    };
  }
}
