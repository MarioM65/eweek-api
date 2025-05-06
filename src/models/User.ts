import { z } from 'zod';
import prisma from '../../plugins/prisma';
import * as bcrypt from 'bcrypt';
import { omit } from 'lodash';

export const CreateUserSchema = z.object({
  vc_pnome: z.string().min(2),
  vc_mnome: z.string().min(2),
  vc_unome: z.string().min(2),
  vc_email: z.string().email().optional(),
  vc_telefone: z.string().min(9),
  vc_bi: z.string().min(10),
  password: z.string().min(6),
  img_perfil: z.string().optional(),
});

export const UpdateUserSchema = CreateUserSchema.partial();

export type CreateUserInput = z.infer<typeof CreateUserSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;

export class UserModel {

  static async create(data: CreateUserInput) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return prisma.user.create({
      data: {
        ...data,
        vc_email: data.vc_email ?? "",
        password: hashedPassword,
      },
      select: this.defaultSelect(),
    });
  }

  static async findAll() {
    return prisma.user.findMany({
      where: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async findById(id: number) {
    return prisma.user.findFirst({
      where: { id, deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async update(id: number, data: UpdateUserInput) {
    const updateData: any = omit(data, 'password');
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }

    return prisma.user.update({
      where: { id },
      data: {
        ...updateData,
        vc_email: data.vc_email ?? undefined,
      },
      select: this.defaultSelect(),
    });
  }

  static async delete(id: number) {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  static async trash() {
    return prisma.user.findMany({
      where: { deletedAt: { not: null } },
      select: this.defaultSelect(),
    });
  }

  static async restore(id: number) {
    return prisma.user.update({
      where: { id },
      data: { deletedAt: null },
      select: this.defaultSelect(),
    });
  }

  static async purge(id: number) {
    return prisma.user.delete({
      where: { id },
    });
  }

  static async checkEmailExists(vc_email: string) {
    const user = await prisma.user.findFirst({
      where: { vc_email, deletedAt: null },
    });
    return !!user;
  }
  static async meus_dados(userId: number) {
    const usuario = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        UserToken: true,
        notificacoes: true,
        contatos: true,
        veiculos: {
          include: {
            item: {
              include: {
                acidentes: true,
                servicos: {
                  include: {
                    servico: true
                  }
                }
              }
            },
            seguro: true
          }
        },
        seguros: {
          include: {
            seguro: {
              include: {
                servicos: {
                  include: {
                    servico: true
                  }
                },
                seguradoras: {
                  include: {
                    seguradora: true
                  }
                },
                veiculos: true,
                items: true
              }
            }
          }
        },
        seguradoras: {
          include: {
            seguradora: {
              include: {
                parceiros: {
                  include: {
                    parceiro: true
                  }
                },
                filiais: true
              }
            }
          }
        },
        acidentes: true,
        apolices: true,
        parentescosUser1: {
          include: {
            user2: true
          }
        },
        parentescosUser2: {
          include: {
            user1: true
          }
        },
        recoveryTokens: true,
        Chat: true,
        Mensagem: true
      }
    });
  
    return usuario;
  }
  private static defaultSelect() {
    return {
      id: true,
      vc_pnome: true,
      vc_mnome: true,
      vc_unome: true,
      vc_telefone: true,
      vc_bi: true,
      vc_email: true,
      img_perfil: true,
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    };
  }
}

