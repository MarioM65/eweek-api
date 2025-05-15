import { z } from "zod";
import prisma from "../../plugins/prisma";

export const CreateContatoEmergenciaSchema = z.object({
  vc_nome: z.string(),
  vc_telefone: z.string(),
  parentesco: z.string(),
  vc_email: z.string().email().optional(),
  userId: z.number(),
});

// Schema de validação para atualizar um contato
export const UpdateContatoEmergenciaSchema = CreateContatoEmergenciaSchema.partial();

export type CreateContatoEmergenciaInput = z.infer<typeof CreateContatoEmergenciaSchema>;
export type UpdateContatoEmergenciaInput = z.infer<typeof UpdateContatoEmergenciaSchema>;
export class ContatoEmergenciaModel {
  static async create(data: CreateContatoEmergenciaInput) {
    return prisma.contatoEmergencia.create({
      data,
      select: this.defaultSelect(),
    });
  }

  static async findAll() {
    return prisma.contatoEmergencia.findMany({
      where: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async findById(id: number) {
    return prisma.contatoEmergencia.findFirst({
      where: { id, deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async update(id: number, data: UpdateContatoEmergenciaInput) {
    return prisma.contatoEmergencia.update({
      where: { id },
      data,
      select: this.defaultSelect(),
    });
  }

  static async delete(id: number) {
    return prisma.contatoEmergencia.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async restore(id: number) {
    return prisma.contatoEmergencia.update({
      where: { id },
      data: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async purge(id: number) {
    return prisma.contatoEmergencia.delete({
      where: { id },
    });
  }
  static async trash() {
    return prisma.contatoEmergencia.findMany({
      where: { deletedAt: { not: null } },
      select: this.defaultSelect(),
    });
  }
  private static defaultSelect() {
    return {
      id: true,
      vc_nome: true,
      vc_telefone: true,
      parentesco: true,
      vc_email: true,
      user:true,
            userId: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    };
  }
}
