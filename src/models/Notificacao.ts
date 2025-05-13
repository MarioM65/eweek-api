import { z } from "zod";
import prisma from "../../plugins/prisma";

export const CreateNotificacaoSchema = z.object({
    dataLeitura: z.date(),
    dataCriacao: z.date(),
    mensagem: z.string().min(2),
    tipo: z.string().min(2),
    referencia: z.string().min(2).optional(),
    status: z.string().min(2),
    userId: z.number(),
    referenciaId: z.number().optional(),
  });
  
  export const UpdateNotificacaoSchema = CreateNotificacaoSchema.partial();
  
  export type CreateNotificacaoInput = z.infer<typeof CreateNotificacaoSchema>;
  export type UpdateNotificacaoInput = z.infer<typeof UpdateNotificacaoSchema>;
  export class NotificacaoModel {
    static async create(data: CreateNotificacaoInput) {
      return prisma.notificacao.create({
        data,
        select: this.defaultSelect(),
      });
    }
  
    static async findAll() {
      return prisma.notificacao.findMany({
        where: { deletedAt: null },
        select: this.defaultSelect(),
      });
    }
  
    static async findById(id: number) {
      return prisma.notificacao.findFirst({
        where: { id, deletedAt: null },
        select: this.defaultSelect(),
      });
    }
  
    static async update(id: number, data: UpdateNotificacaoInput) {
      return prisma.notificacao.update({
        where: { id },
        data,
        select: this.defaultSelect(),
      });
    }
  
    static async delete(id: number) {
      return prisma.notificacao.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    }
  
    static async trash() {
      return prisma.notificacao.findMany({
        where: { deletedAt: { not: null } },
        select: this.defaultSelect(),
      });
    }
  
    static async restore(id: number) {
      return prisma.notificacao.update({
        where: { id },
        data: { deletedAt: null },
        select: this.defaultSelect(),
      });
    }
  
    static async purge(id: number) {
      return prisma.notificacao.delete({
        where: { id },
      });
    }
  
    private static defaultSelect() {
      return {
        id: true,
        dataCriacao: true,
        dataLeitura: true,
        mensagem: true,
        tipo: true,
        status: true,
        referencia: true,
        referenciaId: true,
        user: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      };
    }
  }