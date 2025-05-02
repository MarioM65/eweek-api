// src/models/filial.model.ts
import { z } from 'zod';
import prisma from '../../plugins/prisma';
import { omit } from 'lodash';

export const CreateFilialSchema = z.object({
  vc_nome: z.string().min(2),
  vc_telefone: z.string().min(9),
  fl_lat: z.number(),
  fl_lon: z.number(),
  bl_central: z.boolean(),
  vc_email: z.string().email(),
  password: z.string().min(6),
  seguradoraId: z.number().optional(),
  parceiroId: z.number().optional(),
});

export const UpdateFilialSchema = CreateFilialSchema.partial();

export type CreateFilialInput = z.infer<typeof CreateFilialSchema>;
export type UpdateFilialInput = z.infer<typeof UpdateFilialSchema>;

export class FilialModel {
  static async create(data: CreateFilialInput) {
    return prisma.filial.create({
      data,
      select: this.defaultSelect(),
    });
  }

  static async findAll() {
    return prisma.filial.findMany({
      where: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async findById(id: number) {
    return prisma.filial.findFirst({
      where: { id, deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async update(id: number, data: UpdateFilialInput) {
    return prisma.filial.update({
      where: { id },
      data,
      select: this.defaultSelect(),
    });
  }

  static async delete(id: number) {
    return prisma.filial.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async trash() {
    return prisma.filial.findMany({
      where: { deletedAt: { not: null } },
      select: this.defaultSelect(),
    });
  }

  static async restore(id: number) {
    return prisma.filial.update({
      where: { id },
      data: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async purge(id: number) {
    return prisma.filial.delete({
      where: { id },
    });
  }

  private static defaultSelect() {
    return {
      id: true,
      vc_nome: true,
      vc_telefone: true,
      fl_lat: true,
      fl_lon: true,
      bl_central: true,
      vc_email: true,
      password: true,
      seguradoraId: true,
      parceiroId: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    };
  }
}

// Próximo: SeguradoraModel, ItemModel, AcidenteModel, e as models pivot como UserSeguroModel, etc.
