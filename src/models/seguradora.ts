import { z } from 'zod';
import prisma from '../../plugins/prisma';

export const CreateSeguradoraSchema = z.object({
  vc_nome: z.string().min(2),
  logo: z.string(),
  txt_descricao: z.string(),
});

export const UpdateSeguradoraSchema = CreateSeguradoraSchema.partial();

export type CreateSeguradoraInput = z.infer<typeof CreateSeguradoraSchema>;
export type UpdateSeguradoraInput = z.infer<typeof UpdateSeguradoraSchema>;

export class SeguradoraModel {
    static async create(data: CreateSeguradoraInput) {
      return prisma.seguradora.create({
        data,
        select: this.defaultSelect(),
      });
    }
  
    static async findAll() {
      return prisma.seguradora.findMany({
        where: { deletedAt: null },
        select: this.defaultSelect(),
      });
    }
  
    static async findById(id: number) {
      return prisma.seguradora.findFirst({
        where: { id, deletedAt: null },
        select: this.defaultSelect(),
      });
    }
  
    static async update(id: number, data: UpdateSeguradoraInput) {
      return prisma.seguradora.update({
        where: { id },
        data,
        select: this.defaultSelect(),
      });
    }
  
    static async delete(id: number) {
      return prisma.seguradora.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    }
  
    static async trash() {
      return prisma.seguradora.findMany({
        where: { deletedAt: { not: null } },
        select: this.defaultSelect(),
      });
    }
  
    static async restore(id: number) {
      return prisma.seguradora.update({
        where: { id },
        data: { deletedAt: null },
        select: this.defaultSelect(),
      });
    }
  
    static async purge(id: number) {
      return prisma.seguradora.delete({
        where: { id },
      });
    }


    private static defaultSelect() {
      return {
        id: true,
        vc_nome: true,
        logo: true,
        txt_descricao: true,
        filiais: true,
        parceiros: true,
        apolices:true,
        seguros: true,
        usuarios: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      };
    }
  }