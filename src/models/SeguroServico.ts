import { z } from "zod";
import prisma from "../../plugins/prisma";

export const CreateSeguroServicoSchema = z.object({
  seguroId: z.number(),
  servicoId: z.number(),
});

export const UpdateSeguroServicoSchema = CreateSeguroServicoSchema.partial();

export type CreateSeguroServicoInput = z.infer<typeof CreateSeguroServicoSchema>;
export type UpdateSeguroServicoInput = z.infer<typeof UpdateSeguroServicoSchema>;

export class SeguroServicoModel {
    static async create(data: CreateSeguroServicoInput) {
      return prisma.seguroServico.create({
        data,
        select: this.defaultSelect(),
      });
    }
  
    static async findAll() {
      return prisma.seguroServico.findMany({
        where: { deletedAt: null },
        select: this.defaultSelect(),
      });
    }
  
    static async findById(seguroId: number, servicoId: number) {
      return prisma.seguroServico.findFirst({
        where: { seguroId, servicoId, deletedAt: null },
        select: this.defaultSelect(),
      });
    }
  
    static async delete(seguroId: number, servicoId: number) {
      return prisma.seguroServico.update({
        where: { seguroId_servicoId: { seguroId, servicoId } },
        data: { deletedAt: new Date() },
      });
    }
  
    static async restore(seguroId: number, servicoId: number) {
      return prisma.seguroServico.update({
        where: { seguroId_servicoId: { seguroId, servicoId } },
        data: { deletedAt: null },
        select: this.defaultSelect(),
      });
    }
    static async trash() {
      return prisma.seguroServico.findMany({
        where: { deletedAt: { not: null } },
        select: this.defaultSelect(),
      });
    }
    static async purge(seguroId: number, servicoId: number) {
      return prisma.seguroServico.delete({
        where: { seguroId_servicoId: { seguroId, servicoId } },
      });
    }
    private static defaultSelect() {
      return {
        seguroId: true,
        servicoId: true,
        seguro: true,
        servico: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      };
    }
  }