import { z } from "zod";
import prisma from "../../plugins/prisma";

export const CreateSeguradoraParceiroSchema = z.object({
  parceiroId: z.number(),
  seguradoraId: z.number(),
});

export const UpdateSeguradoraParceiroSchema = CreateSeguradoraParceiroSchema.partial();

export type CreateSeguradoraParceiroInput = z.infer<typeof CreateSeguradoraParceiroSchema>;
export type UpdateSeguradoraParceiroInput = z.infer<typeof UpdateSeguradoraParceiroSchema>;

export class SeguradoraParceiroModel {
  static async create(data: CreateSeguradoraParceiroInput) {
    return prisma.seguradoraParceiro.create({
      data,
      select: this.defaultSelect(),
    });
  }

  static async findAll() {
    return prisma.seguradoraParceiro.findMany({
      where: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async findById(parceiroId: number, seguradoraId: number) {
    return prisma.seguradoraParceiro.findFirst({
      where: { parceiroId, seguradoraId, deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async delete(parceiroId: number, seguradoraId: number) {
    return prisma.seguradoraParceiro.update({
      where: { seguradoraId_parceiroId: { parceiroId, seguradoraId } }, // chave composta
      data: { deletedAt: new Date() },
    });
  }

  static async restore(parceiroId: number, seguradoraId: number) {
    return prisma.seguradoraParceiro.update({
      where: { seguradoraId_parceiroId: { parceiroId, seguradoraId } }, // chave composta
      data: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async purge(parceiroId: number, seguradoraId: number) {
        return prisma.seguradoraParceiro.delete({
          where: { seguradoraId_parceiroId: { parceiroId, seguradoraId } },
        });
      }
      static async trash() {
        return prisma.seguradoraParceiro.findMany({
          where: { deletedAt: { not: null } },
          select: this.defaultSelect(),
        });
      }
  private static defaultSelect() {
    return {
      seguradoraId: true,
      parceiroId: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
      seguradora: true, 
      parceiro: true, 
    };
  }
}
