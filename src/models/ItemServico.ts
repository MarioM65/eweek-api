import { z } from "zod";
import prisma from "../../plugins/prisma";

export const CreateItemServicoSchema = z.object({
  itemId: z.number(),
  servicoId: z.number(),
});

export const UpdateItemServicoSchema = CreateItemServicoSchema.partial();

export type CreateItemServicoInput = z.infer<typeof CreateItemServicoSchema>;
export type UpdateItemServicoInput = z.infer<typeof UpdateItemServicoSchema>;

export class ItemServicoModel {
    static async create(data: CreateItemServicoInput) {
      return prisma.itemServico.create({
        data,
        select: this.defaultSelect(),
      });
    }
  
    static async findAll() {
      return prisma.itemServico.findMany({
        where: { deletedAt: null },
        select: this.defaultSelect(),
      });
    }
  
    static async findById(itemId: number, servicoId: number) {
      return prisma.itemServico.findFirst({
        where: { itemId, servicoId, deletedAt: null },
        select: this.defaultSelect(),
      });
    }
  
    static async delete(itemId: number, servicoId: number) {
      return prisma.itemServico.update({
        where: { itemId_servicoId: { itemId, servicoId } },
        data: { deletedAt: new Date() },
      });
    }
  
    static async restore(itemId: number, servicoId: number) {
      return prisma.itemServico.update({
        where: { itemId_servicoId: { itemId, servicoId } },
        data: { deletedAt: null },
        select: this.defaultSelect(),
      });
    }
    static async trash() {
      return prisma.itemServico.findMany({
        where: { deletedAt: { not: null } },
        select: this.defaultSelect(),
      });
    }
    static async purge(itemId: number, servicoId: number) {
      return prisma.itemServico.delete({
        where: { itemId_servicoId: { itemId, servicoId } },
      });
    }
    private static defaultSelect() {
      return {
        itemId: true,
        servicoId: true,
        item: true,
        servico: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      };
    }
  }