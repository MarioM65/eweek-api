import { z } from "zod";
import prisma from "../../plugins/prisma";

export const CreateAcidenteSchema = z.object({
    data_hora: z.date(),
    localizacao: z.string().min(2),
    tipo: z.string().min(2),
    confirmado: z.boolean(),
    gravidade: z.string().min(2),
    itemId: z.number(),
    usuarioId: z.number(),
  });
  
  export const UpdateAcidenteSchema = CreateAcidenteSchema.partial();
  
  export type CreateAcidenteInput = z.infer<typeof CreateAcidenteSchema>;
  export type UpdateAcidenteInput = z.infer<typeof UpdateAcidenteSchema>;
  export class AcidenteModel {
    static async create(data: CreateAcidenteInput) {
      return prisma.acidente.create({
        data,
        select: this.defaultSelect(),
      });
    }
  
    static async findAll() {
      return prisma.acidente.findMany({
        where: { deletedAt: null },
        select: this.defaultSelect(),
      });
    }
  
    static async findById(id: number) {
      return prisma.acidente.findFirst({
        where: { id, deletedAt: null },
        select: this.defaultSelect(),
      });
    }
  
    static async update(id: number, data: UpdateAcidenteInput) {
      return prisma.acidente.update({
        where: { id },
        data,
        select: this.defaultSelect(),
      });
    }
  
    static async delete(id: number) {
      return prisma.acidente.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    }
  
    static async trash() {
      return prisma.acidente.findMany({
        where: { deletedAt: { not: null } },
        select: this.defaultSelect(),
      });
    }
  
    static async restore(id: number) {
      return prisma.acidente.update({
        where: { id },
        data: { deletedAt: null },
        select: this.defaultSelect(),
      });
    }
  
    static async purge(id: number) {
      return prisma.acidente.delete({
        where: { id },
      });
    }
  
    private static defaultSelect() {
      return {
        id: true,
        data_hora: true,
        localizacao: true,
        tipo: true,
        confirmado: true,
        gravidade: true,
        item: true,
        usuario: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      };
    }
  }