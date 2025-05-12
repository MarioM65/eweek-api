import { z } from 'zod';
import prisma from '../../plugins/prisma';

export const CreatePagamentoSchema = z.object({
  dataPagamento: z.date(),
  valor: z.number().min(0),
  estado: z.string().min(2),
    apoliceId: z.number(),

});

export const UpdatePagamentoSchema = CreatePagamentoSchema.partial();

export type CreatePagamentoInput = z.infer<typeof CreatePagamentoSchema>;
export type UpdatePagamentoInput = z.infer<typeof UpdatePagamentoSchema>;

export class PagamentoModel {
  static async create(data: CreatePagamentoInput) {
    return prisma.pagamento.create({
      data,
      select: this.defaultSelect(),
    });
  }

  static async findAll() {
    return prisma.pagamento.findMany({
      where: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async findById(id: number) {
    return prisma.pagamento.findFirst({
      where: { id, deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async update(id: number, data: UpdatePagamentoInput) {
    return prisma.pagamento.update({
      where: { id },
      data,
      select: this.defaultSelect(),
    });
  }

  static async delete(id: number) {
    return prisma.pagamento.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async restore(id: number) {
    return prisma.pagamento.update({
      where: { id },
      data: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async purge(id: number) {
    return prisma.pagamento.delete({
      where: { id },
    });
  }
  static async trash() {
    return prisma.pagamento.findMany({
      where: { deletedAt: { not: null } },
      select: this.defaultSelect(),
    });
  }
  private static defaultSelect() {
    return {
      id: true,
      dataPagamento: true,
      valor: true,
      estado: true,
      apoliceId: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    };
  }
}
