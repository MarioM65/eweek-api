import { z } from "zod";
import prisma from "../../plugins/prisma";

export const CreateSeguroSeguradoraSchema = z.object({
    seguroId: z.number(),
    seguradoraId: z.number(),
  });
  
  export const UpdateSeguroSeguradoraSchema = CreateSeguroSeguradoraSchema.partial();
  
  export type CreateSeguroSeguradoraInput = z.infer<typeof CreateSeguroSeguradoraSchema>;
  export type UpdateSeguroSeguradoraInput = z.infer<typeof UpdateSeguroSeguradoraSchema>;
  
export class SeguroSeguradoraModel {
    static async create(data: CreateSeguroSeguradoraInput) {
      return prisma.seguroSeguradora.create({
        data,
        select: this.defaultSelect(),
      });
    }
  
    static async findAll() {
      return prisma.seguroSeguradora.findMany({
        where: { deletedAt: null },
        select: this.defaultSelect(),
      });
    }
  
    static async findById(seguroId: number, seguradoraId: number) {
      return prisma.seguroSeguradora.findFirst({
        where: { seguroId, seguradoraId, deletedAt: null },
        select: this.defaultSelect(),
      });
    }
    static async trash() {
        return prisma.seguroSeguradora.findMany({
          where: { deletedAt: { not: null } },
          select: this.defaultSelect(),
        });
      }
    static async delete(seguroId: number, seguradoraId: number) {
      return prisma.seguroSeguradora.update({
        where: { seguroId_seguradoraId: { seguroId, seguradoraId } },
        data: { deletedAt: new Date() },
      });
    }
    static async purge(seguroId: number, seguradoraId: number) {
        return prisma.seguroSeguradora.delete({
          where: { seguroId_seguradoraId: { seguroId, seguradoraId } },
        });
      }
    static async restore(seguroId: number, seguradoraId: number) {
      return prisma.seguroSeguradora.update({
        where: { seguroId_seguradoraId: { seguroId, seguradoraId } },
        data: { deletedAt: null },
        select: this.defaultSelect(),
      });
    }
  
    private static defaultSelect() {
      return {
        seguroId: true,
        seguradoraId: true,
        seguro: true,
        seguradora: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      };
    }
  }
  