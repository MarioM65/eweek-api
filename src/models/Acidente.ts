import { z } from "zod";
import prisma from "../../plugins/prisma";
import { enviarEmail } from "../utils/mailer";

export const CreateAcidenteSchema = z.object({
     tipo: z.string().min(2),
  localizacao: z.string(),
  data_hora: z.string(),
  confirmado: z.boolean(),
  gravidade: z.string(),
  itemId: z.number(),
  atendido:z.boolean().optional(),
  usuarioId: z.number()
  });
  
  export const UpdateAcidenteSchema = CreateAcidenteSchema.partial();
  interface EmailData {
  para: string;
  user: string;
  data: string;
    hora: string;
  localizacao: string;
}
  export type CreateAcidenteInput = z.infer<typeof CreateAcidenteSchema>;
  export type UpdateAcidenteInput = z.infer<typeof UpdateAcidenteSchema>;
  export class AcidenteModel {
static async create(data: CreateAcidenteInput) {
  const aci = await prisma.acidente.create({
    data,
    select: this.defaultSelect(),
  });

  const user = await prisma.user.findFirst({
    where: { id: data.usuarioId, deletedAt: null },
    select: this.defaultSelect2(),
  });

  const parentescos = await prisma.parentesco.findMany({
    where: {
      deletedAt: null,
      OR: [
        { user1Id: data.usuarioId },
        { user2Id: data.usuarioId },
      ],
    },
    include: {
      user1: true,
      user2: true,
    },
  });

  // Extrair parentes com seus e-mails
  const usuariosParentes = parentescos.map((p: { user1Id: number; user2: any; user1: any; }) => {
    return p.user1Id === data.usuarioId ? p.user2 : p.user1;
  });

  // Preencher o array de EmailData
const dataHora = new Date(aci.data_hora);
const dataFormatada = dataHora.toISOString().split('T')[0]; // "2025-05-13"
const horaFormatada = dataHora.toTimeString().slice(0, 5);  // "14:30"
const contactos = user?.contatos ?? [];

const emailsContatos: EmailData[] = contactos.map((contato: { vc_email: any; }) => ({
  para: contato.vc_email ?? '', // caso seja opcional
  user: user?.vc_pnome ?? 'Usuário desconhecido',
  data: dataFormatada,
  hora: horaFormatada,
  localizacao: aci.localizacao,
}));
const emails: EmailData[] = usuariosParentes.map((parente: { vc_email: any; }) => ({
  para: parente.vc_email,
  user: user?.vc_pnome ?? 'Usuário desconhecido',
  data: dataFormatada, // agora é string
  hora: horaFormatada, // também string
  localizacao: aci.localizacao,
}));
console.log(emails)
await Promise.all(emails.map(email => enviarEmail(email)));
  return { aci, parentes: usuariosParentes, user:user?.contatos, emails, contactos };
}

static async fake() {
  const data = {
  tipo: "Colisão",
  localizacao: "-8.8563, 13.2436", // ITEL, Luanda
  data_hora: new Date().toISOString(),
  confirmado: true,
  gravidade: "Alta, sem resposta",
  itemId: 2,
  usuarioId: 1
};


  const aci = await prisma.acidente.create({
    data,
    select: this.defaultSelect(),
  });

  const user = await prisma.user.findFirst({
    where: { id: data.usuarioId, deletedAt: null },
    select: this.defaultSelect2(),
  });

  const parentescos = await prisma.parentesco.findMany({
    where: {
      deletedAt: null,
      OR: [
        { user1Id: data.usuarioId },
        { user2Id: data.usuarioId },
      ],
    },
    include: {
      user1: true,
      user2: true,
    },
  });

  // Extrair parentes com seus e-mails
  const usuariosParentes = parentescos.map((p: { user1Id: number; user2: any; user1: any; }) => {
    return p.user1Id === data.usuarioId ? p.user2 : p.user1;
  });

  // Preencher o array de EmailData
const dataHora = new Date(aci.data_hora);
const dataFormatada = dataHora.toISOString().split('T')[0]; // "2025-05-13"
const horaFormatada = dataHora.toTimeString().slice(0, 5);  // "14:30"
const contactos = user?.contatos ?? [];

const emailsContatos: EmailData[] = contactos.map((contato: { vc_email: any; }) => ({
  para: contato.vc_email ?? '', // caso seja opcional
  user: user?.vc_pnome ?? 'Usuário desconhecido',
  data: dataFormatada,
  hora: horaFormatada,
  localizacao: aci.localizacao,
}));
const emails: EmailData[] = usuariosParentes.map((parente: { vc_email: any; }) => ({
  para: parente.vc_email,
  user: user?.vc_pnome ?? 'Usuário desconhecido',
  data: dataFormatada, // agora é string
  hora: horaFormatada, // também string
  localizacao: aci.localizacao,
}));
console.log(emails)
await Promise.all(emails.map(email => enviarEmail(email)));
  return { aci, parentes: usuariosParentes, user:user?.contatos, emails, contactos };
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
    static async check(id: number) {
      let acidente = await prisma.acidente.findFirst({
        where: {
          usuarioId: id,
          deletedAt: null,
          confirmado: true,
          atendido: false,
          updatedAt: {
            equals: prisma.acidente.fields.createdAt,
          },
        },
        orderBy: [
          { updatedAt: 'desc' },
          { createdAt: 'desc' },
        ],
        select: this.defaultSelect(),
      });
      
    
      if (acidente) {
        await prisma.acidente.update({
          where: { id: acidente.id },
          data: {
            gravidade: acidente.gravidade + ' ',
          },
        });
      }
    
      return acidente;
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
     private static defaultSelect2() {
    return {
      id: true,
      contatos : true,
  vc_pnome: true,
      vc_mnome: true,
      vc_unome: true,
    };
  }
  }