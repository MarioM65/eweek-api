import { z } from 'zod';
import prisma from '../../plugins/prisma';

const defaultSelect = {
  id: true,
  vc_nome: true,
  logo: true,
  txt_descricao: true,
  filiais:true,
  seguradoras:true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
};

export const CreateParceiroSchema = z.object({
  vc_nome: z.string().min(2),
  logo: z.string(),
  txt_descricao: z.string(),
});

export const UpdateParceiroSchema = CreateParceiroSchema.partial();
export type CreateParceiroInput = z.infer<typeof CreateParceiroSchema>;
export type UpdateParceiroInput = z.infer<typeof UpdateParceiroSchema>;

export class ParceiroModel {
  static async create(data: CreateParceiroInput) {
    return prisma.parceiro.create({ data, select: defaultSelect });
  }

  static async findAll() {
    return prisma.parceiro.findMany({
      where: { deletedAt: null },
      select: defaultSelect,
    });
  }

  static async findById(id: number) {
    return prisma.parceiro.findFirst({
      where: { id, deletedAt: null },
      select: defaultSelect,
    });
  }

  static async update(id: number, data: UpdateParceiroInput) {
    return prisma.parceiro.update({
      where: { id },
      data,
      select: defaultSelect,
    });
  }

  static async delete(id: number) {
    return prisma.parceiro.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async trash() {
    return prisma.parceiro.findMany({
      where: { deletedAt: { not: null } },
      select: defaultSelect,
    });
  }

  static async restore(id: number) {
    return prisma.parceiro.update({
      where: { id },
      data: { deletedAt: null },
      select: defaultSelect,
    });
  }

  static async purge(id: number) {
    return prisma.parceiro.delete({ where: { id } });
  }
}
