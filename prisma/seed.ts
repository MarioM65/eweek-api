import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Função auxiliar para hashear senhas
const hashPassword = async (password: string) => {
  return await bcrypt.hash(password, 10);
};

async function main() {
  // Criando múltiplos usuários
  const users = await Promise.all([
    prisma.user.upsert({
      where: { vc_email: 'mario.silva@example.com' },
      update: {},
      create: {
        vc_pnome: 'Mário',
        vc_mnome: 'José',
        vc_unome: 'Silva',
        vc_telefone: '+351923456789',
        vc_bi: '1234567890',
        vc_email: 'mario.silva@example.com',
        password: await hashPassword('senha123'),
        img_perfil: 'https://example.com/perfil/mario.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { vc_email: 'ana.souza@example.com' },
      update: {},
      create: {
        vc_pnome: 'Ana',
        vc_mnome: 'Clara',
        vc_unome: 'Souza',
        vc_telefone: '+351923987654',
        vc_bi: '0987654321',
        vc_email: 'ana.souza@example.com',
        password: await hashPassword('senha456'),
        img_perfil: 'https://example.com/perfil/ana.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { vc_email: 'carlos.oliveira@example.com' },
      update: {},
      create: {
        vc_pnome: 'Carlos',
        vc_mnome: 'Eduardo',
        vc_unome: 'Oliveira',
        vc_telefone: '+351923123456',
        vc_bi: '1122334455',
        vc_email: 'carlos.oliveira@example.com',
        password: await hashPassword('senha789'),
        img_perfil: 'https://example.com/perfil/carlos.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.user.upsert({
      where: { vc_email: 'julia.mendes@example.com' },
      update: {},
      create: {
        vc_pnome: 'Júlia',
        vc_mnome: 'Maria',
        vc_unome: 'Mendes',
        vc_telefone: '+351923555666',
        vc_bi: '6677889900',
        vc_email: 'julia.mendes@example.com',
        password: await hashPassword('senha101'),
        img_perfil: 'https://example.com/perfil/julia.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  // Criando seguradoras
  const seguradoras = await Promise.all([
    prisma.seguradora.upsert({
      where: { id: 1 },
      update: {},
      create: {
        vc_nome: 'Seguradora XYZ',
        logo: 'https://example.com/logo/xyz.png',
        txt_descricao: 'Seguradora renomada no mercado de seguros.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.seguradora.upsert({
      where: { id: 2 },
      update: {},
      create: {
        vc_nome: 'Seguradora ABC',
        logo: 'https://example.com/logo/abc.png',
        txt_descricao: 'Líder em seguros automotivos.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.seguradora.upsert({
      where: { id: 3 },
      update: {},
      create: {
        vc_nome: 'Seguradora Global',
        logo: 'https://example.com/logo/global.png',
        txt_descricao: 'Especialista em seguros residenciais e de vida.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  // Criando seguros
  const seguros = await Promise.all([
    prisma.seguro.upsert({
      where: { id: 1 },
      update: {},
      create: {
        vc_nome: 'Seguro Auto Premium',
        fl_preco: 200.0,
        txt_descricao: 'Cobertura completa para automóveis.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.seguro.upsert({
      where: { id: 2 },
      update: {},
      create: {
        vc_nome: 'Seguro Vida',
        fl_preco: 100.0,
        txt_descricao: 'Proteção para você e sua família.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.seguro.upsert({
      where: { id: 3 },
      update: {},
      create: {
        vc_nome: 'Seguro Residencial',
        fl_preco: 150.0,
        txt_descricao: 'Cobertura para sua casa.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.seguro.upsert({
      where: { id: 4 },
      update: {},
      create: {
        vc_nome: 'Seguro Viagem',
        fl_preco: 80.0,
        txt_descricao: 'Proteção para suas viagens.',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  // Relacionando seguros com seguradoras
  await Promise.all([
    prisma.seguroSeguradora.upsert({
      where: { seguroId_seguradoraId: { seguroId: seguros[0].id, seguradoraId: seguradoras[0].id } },
      update: {},
      create: {
        seguroId: seguros[0].id,
        seguradoraId: seguradoras[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.seguroSeguradora.upsert({
      where: { seguroId_seguradoraId: { seguroId: seguros[1].id, seguradoraId: seguradoras[1].id } },
      update: {},
      create: {
        seguroId: seguros[1].id,
        seguradoraId: seguradoras[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.seguroSeguradora.upsert({
      where: { seguroId_seguradoraId: { seguroId: seguros[2].id, seguradoraId: seguradoras[2].id } },
      update: {},
      create: {
        seguroId: seguros[2].id,
        seguradoraId: seguradoras[2].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.seguroSeguradora.upsert({
      where: { seguroId_seguradoraId: { seguroId: seguros[3].id, seguradoraId: seguradoras[0].id } },
      update: {},
      create: {
        seguroId: seguros[3].id,
        seguradoraId: seguradoras[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  // Criando contatos de emergência
  await Promise.all([
    prisma.contatoEmergencia.create({
      data: {
        vc_nome: 'Mãe do Mário',
        vc_telefone: '+351923123456',
        parentesco: 'Mãe',
        userId: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.contatoEmergencia.create({
      data: {
        vc_nome: 'Pai do Mário',
        vc_telefone: '+351923654321',
        parentesco: 'Pai',
        userId: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.contatoEmergencia.create({
      data: {
        vc_nome: 'Irmão da Ana',
        vc_telefone: '+351923111222',
        parentesco: 'Irmão',
        userId: users[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.contatoEmergencia.create({
      data: {
        vc_nome: 'Esposa do Carlos',
        vc_telefone: '+351923333444',
        parentesco: 'Esposa',
        userId: users[2].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.contatoEmergencia.create({
      data: {
        vc_nome: 'Mãe da Júlia',
        vc_telefone: '+351923777888',
        parentesco: 'Mãe',
        userId: users[3].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  // Criando itens e veículos
  const items = await Promise.all([
    prisma.item.upsert({
      where: { id: 1 },
      update: {},
      create: {
        vc_nome: 'Fiat Uno',
        txt_descricao: 'Fiat Uno 2020',
        tipo_item: 'Carro',
        bl_veiculo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.item.upsert({
      where: { id: 2 },
      update: {},
      create: {
        vc_nome: 'Honda CB 500',
        txt_descricao: 'Moto Honda CB 500 2021',
        tipo_item: 'Moto',
        bl_veiculo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.item.upsert({
      where: { id: 3 },
      update: {},
      create: {
        vc_nome: 'Volkswagen Golf',
        txt_descricao: 'Volkswagen Golf 2019',
        tipo_item: 'Carro',
        bl_veiculo: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.item.upsert({
      where: { id: 4 },
      update: {},
      create: {
        vc_nome: 'Casa de PraiaINTERVAL 7 DAY',
        txt_descricao: 'Casa de praia no litoral',
        tipo_item: 'Imóvel',
        bl_veiculo: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);
  await Promise.all([
    prisma.veiculoInfo.create({
      data: {
        vc_matricula: 'ABC1234',
        modelo: 'Fiat Uno 2020',
        itemId: items[0].id,
        userId: users[0].id,
        seguroId: seguros[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.veiculoInfo.create({
      data: {
        vc_matricula: 'XYZ5678',
        modelo: 'Honda CB 500 2021',
        itemId: items[1].id,
        userId: users[1].id,
        seguroId: seguros[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.veiculoInfo.create({
      data: {
        vc_matricula: 'DEF9012',
        modelo: 'Volkswagen Golf 2019',
        itemId: items[2].id,
        userId: users[2].id,
        seguroId: seguros[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.itemInfo.create({
      data: {
        vc_nome: 'Casa de Praia',
        txt_descricao: 'Casa de praia no litoral',
        itemId: items[3].id,
        userId: users[3].id,
        seguroId: seguros[2].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  // Relacionando usuários com seguros
  await Promise.all([
    prisma.userSeguro.create({
      data: {
        userId: users[0].id,
        seguroId: seguros[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.userSeguro.create({
      data: {
        userId: users[1].id,
        seguroId: seguros[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.userSeguro.create({
      data: {
        userId: users[2].id,
        seguroId: seguros[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.userSeguro.create({
      data: {
        userId: users[3].id,
        seguroId: seguros[2].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  // Relacionando usuários com seguradoras
  await Promise.all([
    prisma.userSeguradora.create({
      data: {
        userId: users[0].id,
        seguradoraId: seguradoras[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.userSeguradora.create({
      data: {
        userId: users[1].id,
        seguradoraId: seguradoras[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.userSeguradora.create({
      data: {
        userId: users[2].id,
        seguradoraId: seguradoras[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.userSeguradora.create({
      data: {
        userId: users[3].id,
        seguradoraId: seguradoras[2].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  // Criando apólices
  const apolices = await Promise.all([
    prisma.apolice.upsert({
      where: { numero: 'AP123456' },
      update: {},
      create: {
        numero: 'AP123456',
        valorMensal: 200.0,
        dataInicio: new Date('2025-01-01'),
        dataFim: new Date('2026-01-01'),
        ativa: true,
        userId: users[0].id,
        seguradoraId: seguradoras[0].id,
        seguroId: seguros[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.apolice.upsert({
      where: { numero: 'AP789012' },
      update: {},
      create: {
        numero: 'AP789012',
        valorMensal: 100.0,
        dataInicio: new Date('2025-02-01'),
        dataFim: new Date('2026-02-01'),
        ativa: true,
        userId: users[1].id,
        seguradoraId: seguradoras[1].id,
        seguroId: seguros[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.apolice.upsert({
      where: { numero: 'AP345678' },
      update: {},
      create: {
        numero: 'AP345678',
        valorMensal: 150.0,
        dataInicio: new Date('2025-03-01'),
        dataFim: new Date('2026-03-01'),
        ativa: true,
        userId: users[2].id,
        seguradoraId: seguradoras[0].id,
        seguroId: seguros[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.apolice.upsert({
      where: { numero: 'AP901234' },
      update: {},
      create: {
        numero: 'AP901234',
        valorMensal: 80.0,
        dataInicio: new Date('2025-04-01'),
        dataFim: new Date('2026-04-01'),
        ativa: true,
        userId: users[3].id,
        seguradoraId: seguradoras[2].id,
        seguroId: seguros[2].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  // Criando pagamentos
  await Promise.all([
    prisma.pagamento.create({
      data: {
        valor: 200.0,
        dataPagamento: new Date('2025-01-15'),
        estado: 'pago',
        apoliceId: apolices[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.pagamento.create({
      data: {
        valor: 100.0,
        dataPagamento: new Date('2025-02-15'),
        estado: 'pago',
        apoliceId: apolices[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.pagamento.create({
      data: {
        valor: 150.0,
        dataPagamento: new Date('2025-03-15'),
        estado: 'pago',
        apoliceId: apolices[2].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.pagamento.create({
      data: {
        valor: 80.0,
        dataPagamento: new Date('2025-04-15'),
        estado: 'pago',
        apoliceId: apolices[3].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  // Criando notificações (corrigido referenciaId para String)
  await Promise.all([
    prisma.notificacao.create({
      data: {
        mensagem: 'Pagamento da apólice AP123456 confirmado.',
        tipo: 'informação',
        status: 'não lida',
        userId: users[0].id,
        referenciaId: apolices[0].id, // Mantido como string, já que apolice.id é String
        referencia: 'Apolice',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.notificacao.create({
      data: {
        mensagem: 'Pagamento da apólice AP789012 confirmado.',
        tipo: 'informação',
        status: 'não lida',
        userId: users[1].id,
        referenciaId: apolices[1].id, // Mantido como string
        referencia: 'Apolice',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.notificacao.create({
      data: {
        mensagem: 'Novo seguro de viagem disponível.',
        tipo: 'alerta',
        status: 'não lida',
        userId: users[2].id,
        referencia: 'Seguro',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.notificacao.create({
      data: {
        mensagem: 'Apólice AP901234 ativada com sucesso.',
        tipo: 'informação',
        status: 'não lida',
        userId: users[3].id,
        referenciaId: apolices[3].id, // Mantido como string
        referencia: 'Apolice',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  // Criando parentescos
  await Promise.all([
    prisma.parentesco.upsert({
      where: { user1Id_user2Id: { user1Id: users[0].id, user2Id: users[1].id } },
      update: {},
      create: {
        parentesco: 'Irmão',
        user1Id: users[0].id,
        user2Id: users[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.parentesco.upsert({
      where: { user1Id_user2Id: { user1Id: users[2].id, user2Id: users[3].id } },
      update: {},
      create: {
        parentesco: 'Cônjuge',
        user1Id: users[2].id,
        user2Id: users[3].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  // Criando chats
  const chats = await Promise.all([
    prisma.chat.upsert({
      where: { id: 1 },
      update: {},
      create: {
        nome: 'Suporte Seguro Auto',
        criadoPor: users[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
        usuarios: {
          connect: [{ id: users[0].id }, { id: users[1].id }],
        },
      },
    }),
    prisma.chat.upsert({
      where: { id: 2 },
      update: {},
      create: {
        nome: 'Suporte Seguro Residencial',
        criadoPor: users[2].id,
        createdAt: new Date(),
        updatedAt: new Date(),
        usuarios: {
          connect: [{ id: users[2].id }, { id: users[3].id }],
        },
      },
    }),
  ]);

  // Criando mensagens
  await Promise.all([
    prisma.mensagem.create({
      data: {
        conteudo: 'Olá, preciso de ajuda com minha apólice.',
        userId: users[0].id,
        chatId: chats[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.mensagem.create({
      data: {
        conteudo: 'Claro, posso ajudar! Qual é o problema?',
        userId: users[1].id,
        chatId: chats[0].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.mensagem.create({
      data: {
        conteudo: 'Minha casa sofreu um dano. Como aciono o seguro?',
        userId: users[2].id,
        chatId: chats[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
    prisma.mensagem.create({
      data: {
        conteudo: 'Por favor, envie os detalhes do sinistro.',
        userId: users[3].id,
        chatId: chats[1].id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    }),
  ]);

  console.log('Dados de exemplo inseridos com sucesso!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });