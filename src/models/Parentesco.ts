import { z } from 'zod';
import prisma from '../../plugins/prisma';

export const CreateParentescoSchema = z.object({
  parentesco: z.string().min(2),
  user1Id: z.number(),
  user2Id: z.number(),
});

export const UpdateParentescoSchema = CreateParentescoSchema.partial();

export type CreateParentescoInput = z.infer<typeof CreateParentescoSchema>;
export type UpdateParentescoInput = z.infer<typeof UpdateParentescoSchema>;

export class ParentescoModel {
  static async create(data: CreateParentescoInput) {
    return prisma.parentesco.create({
      data,
      select: this.defaultSelect(),
    });
  }

  static async findAll() {
    return prisma.parentesco.findMany({
      where: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async findById(id: number) {
    return prisma.parentesco.findFirst({
      where: { id, deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async update(id: number, data: UpdateParentescoInput) {
    return prisma.parentesco.update({
      where: { id },
      data,
      select: this.defaultSelect(),
    });
  }

  static async delete(id: number) {
    return prisma.parentesco.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async restore(id: number) {
    return prisma.parentesco.update({
      where: { id },
      data: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async purge(id: number) {
    return prisma.parentesco.delete({
      where: { id },
    });
  }
  static async trash() {
    return prisma.parentesco.findMany({
      where: { deletedAt: { not: null } },
      select: this.defaultSelect(),
    });
  }
  private static defaultSelect() {
    return {
      id: true,
      parentesco: true,
      user1Id: true,
      user2Id: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    };
  }
}
