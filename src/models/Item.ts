import { z } from "zod";
import prisma from "../../plugins/prisma";

export const CreateItemSchema = z.object({
    vc_nome: z.string().min(2),
    txt_descricao: z.string().min(10),
    tipo_item: z.string().min(2)
  });
  
  export const UpdateItemSchema = CreateItemSchema.partial();
  
  export type CreateItemInput = z.infer<typeof CreateItemSchema>;
  export type UpdateItemInput = z.infer<typeof UpdateItemSchema>;
  
export class ItemModel {
    static async create(data: CreateItemInput) {
      return prisma.item.create({
        data,
        select: this.defaultSelect(),
      });
    }
  
    static async findAll() {
      return prisma.item.findMany({
        where: { deletedAt: null },
        select: this.defaultSelect(),
      });
    }
  
    static async findById(id: number) {
      return prisma.item.findFirst({
        where: { id, deletedAt: null },
        select: this.defaultSelect(),
      });
    }
  
    static async update(id: number, data: UpdateItemInput) {
      return prisma.item.update({
        where: { id },
        data,
        select: this.defaultSelect(),
      });
    }
  
    static async delete(id: number) {
      return prisma.item.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    }
  
    static async trash() {
      return prisma.item.findMany({
        where: { deletedAt: { not: null } },
        select: this.defaultSelect(),
      });
    }
  
    static async restore(id: number) {
      return prisma.item.update({
        where: { id },
        data: { deletedAt: null },
        select: this.defaultSelect(),
      });
    }
  
    static async purge(id: number) {
      return prisma.item.delete({
        where: { id },
      });
    }
  
    private static defaultSelect() {
      return {
        id: true,
        vc_nome: true,
        txt_descricao: true,
        tipo_item: true,
        veiculo: true,
        servicos: true,
        acidentes: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      };
    }
  }
  