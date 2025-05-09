import { z } from "zod";
import prisma from "../../plugins/prisma";

export const CreateUserSeguroSchema = z.object({
    userId: z.number(),
    seguroId: z.number(),
  });
  
  export const UpdateUserSeguroSchema = CreateUserSeguroSchema.partial();
  
  export type CreateUserSeguroInput = z.infer<typeof CreateUserSeguroSchema>;
  export type UpdateUserSeguroInput = z.infer<typeof UpdateUserSeguroSchema>;
  
export class UserSeguroModel {
    static async create(data: CreateUserSeguroInput) {
      return prisma.userSeguro.create({
        data,
        select: this.defaultSelect(),
      });
    }
    static async findByUser(userId: number) {
      return prisma.userSeguro.findFirst({
        where: { userId, deletedAt: null },
        select: this.defaultSelect(),
      });
    }
    static async findAll() {
      return prisma.userSeguro.findMany({
        where: { deletedAt: null },
        select: this.defaultSelect(),
      });
    }
  
    static async findById(userId: number, seguroId: number) {
      return prisma.userSeguro.findFirst({
        where: { userId, seguroId, deletedAt: null },
        select: this.defaultSelect(),
      });
    }
  
    static async delete(userId: number, seguroId: number) {
      return prisma.userSeguro.update({
        where: { userId_seguroId: { userId, seguroId } },
        data: { deletedAt: new Date() },
      });
    }
  
    static async restore(userId: number, seguroId: number) {
      return prisma.userSeguro.update({
        where: { userId_seguroId: { userId, seguroId } },
        data: { deletedAt: null },
        select: this.defaultSelect(),
      });
    }
    static async trash() {
        return prisma.userSeguro.findMany({
          where: { deletedAt: { not: null } },
          select: this.defaultSelect(),
        });
      }
      static async purge(userId: number, seguroId: number) {
        return prisma.userSeguro.delete({
            where: { userId_seguroId: { userId, seguroId } },
        });
      }
    private static defaultSelect() {
      return {
        userId: true,
        seguroId: true,
        user: true,
        seguro: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
      };
    }
  }