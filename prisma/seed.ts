import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";


const prisma = new PrismaClient();

async function main() {

  const hashedPassword = await bcrypt.hash("12345678", 10); // Substitua "admin123" pela senha real

  console.log("🌱 Iniciando Seed...");

  // Criando ou buscando Status "Online"
  let statusOnline = await prisma.status.findUnique({
    where: { id: 1 },
  });

  if (!statusOnline) {
    statusOnline = await prisma.status.create({
      data: { status: "Online", ip_address: "127.0.0.1" },
    });
  }

  // Criando ou buscando Status "Offline"
  let statusOffline = await prisma.status.findUnique({
    where: { id: 2 },
  });

  if (!statusOffline) {
    statusOffline = await prisma.status.create({
      data: { status: "Offline", ip_address: "127.0.0.1" },
    });
  }

  console.log("✅ Status criados!");

  // Criando ou buscando Profile "Administrador"
  let adminProfile = await prisma.profile.findUnique({
    where: { id: 1 },
  });

  if (!adminProfile) {
    adminProfile = await prisma.profile.create({
      data: {
        name: "Admin"
      },
    });
  }

  console.log("✅ Perfil Administrador criado!");
  // Criando ou buscando Profile "Administrador"
  let trabalhadorProfile = await prisma.profile.findUnique({
    where: { id: 2 },
  });

  if (!trabalhadorProfile) {
    trabalhadorProfile = await prisma.profile.create({
      data: {
        name: "Trabalhador"
      },
    });
  }

  console.log("✅ Perfil Trabalhador criado!");
  // Criando ou buscando Profile "Administrador"
  let clienteProfile = await prisma.profile.findUnique({
    where: { id: 3 },
  });

  if (!clienteProfile) {
    clienteProfile = await prisma.profile.create({
      data: {
        name: "Cliente"
      },
    });
  }

  console.log("✅ Perfil Cliente criado!");

  // Criar Usuário Admin
  await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      firstName: "Admin",
      lastName: "User",
      username: "admin",
      email: "admin@example.com",
      phone: "900000000",
      password: hashedPassword,
      statusId: statusOnline.id,
      bi: "123456789LA",
      profileId: adminProfile.id, // Usando o ID do perfil criado acima
    },
  });

  console.log("✅ Usuário Admin criado!");
}

main()
  .catch((e) => {
    console.error("❌ Erro ao executar Seed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
