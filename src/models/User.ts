import { z } from 'zod';
import prisma from '../lib/prisma';
import * as bcrypt from 'bcrypt';
import { omit } from 'lodash';

export const CreateUserSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Invalid email format').optional(),
  phone: z.string().min(9, 'Phone must be at least 9 characters'),
  bi: z.string().min(14, 'BI must be at least 14 characters'),
  profileId: z.number(),
  avatarUrl: z.string().optional(),
  statusId: z.number(),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  address: z.string().optional(), // Adicionar essa linha
  exp: z.string().optional(),
  description: z.string().optional(),
  profession: z.string().optional(),
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
        email: data.email ?? "",
        password: hashedPassword,
      },
      select: this.defaultSelect(),
    });
  }

  static async findAll() {
    return prisma.user.findMany({
      select: this.defaultSelect(),
    });
  }

  static async findById(id: number) {
    return prisma.user.findUnique({
      where: { id },
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
        email: data.email ?? undefined,
      },
      select: this.defaultSelect(),
    });
  }

  static async delete(id: number) {
    return prisma.user.delete({
      where: { id },
    });
  }

  static async checkUsernameExists(username: string) {
    const user = await prisma.user.findUnique({ where: { username } });
    return !!user;
  }

  static async checkEmailExists(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    return !!user;
  }

  private static defaultSelect() {
    return {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      phone: true,
      bi: true,
      profileId: true,
      statusId: true,
      avatarUrl: true, // Adicionado aqui
      createdAt: true,
      updatedAt: true,
    };
  }
}
