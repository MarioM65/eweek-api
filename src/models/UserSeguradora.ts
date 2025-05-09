import { z } from "zod";
import prisma from "../../plugins/prisma";

export const CreateUserSeguradoraSchema = z.object({
    userId: z.number(),
    seguradoraId: z.number(),
  });
  
  export const UpdateUserSeguradoraSchema = CreateUserSeguradoraSchema.partial();
  
  export type CreateUserSeguradoraInput = z.infer<typeof CreateUserSeguradoraSchema>;
  export type UpdateUserSeguradoraInput = z.infer<typeof UpdateUserSeguradoraSchema>;
  
export class UserSeguradoraModel {
    static async create(data: CreateUserSeguradoraInput) {
      return prisma.userSeguradora.create({
        data,
        select: this.defaultSelect(),
      });
    }
  
    static async findAll() {
      return prisma.userSeguradora.findMany({
        where: { deletedAt: null },
        select: this.defaultSelect(),
      });
    }
  
    static async findById(userId: number, seguradoraId: number) {
      return prisma.userSeguradora.findFirst({
        where: { userId, seguradoraId, deletedAt: null },
        select: this.defaultSelect(),
      });
    }
    static async findByUser(userId: number) {
      return prisma.userSeguradora.findFirst({
        where: { userId, deletedAt: null },
        select: this.defaultSelect(),
      });
    }
    static async delete(userId: number, seguradoraId: number) {
      return prisma.userSeguradora.update({
        where: { userId_seguradoraId: { userId, seguradoraId } },
        data: { deletedAt: new Date() },
      });
    }
  
    static async restore(userId: number, seguradoraId: number) {
      return prisma.userSeguradora.update({
        where: { userId_seguradoraId: { userId, seguradoraId } },
        data: { deletedAt: null },
        select: this.defaultSelect(),
      });
    }
    static async trash() {
        return prisma.userSeguradora.findMany({
          where: { deletedAt: { not: null } },
          select: this.defaultSelect(),
        });
      }
      static async purge(userId: number, seguradoraId: number) {
        return prisma.userSeguradora.delete({
            where: { userId_seguradoraId: { userId, seguradoraId } },
        });
      }
    private static defaultSelect() {
      return {
        userId: true,
        seguradoraId: true,
        user: true,
        seguradora: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      };
    }
  }
  