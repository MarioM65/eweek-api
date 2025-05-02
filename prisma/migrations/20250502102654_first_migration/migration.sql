-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "vc_pnome" TEXT NOT NULL,
    "vc_mnome" TEXT NOT NULL,
    "vc_unome" TEXT NOT NULL,
    "vc_telefone" TEXT NOT NULL,
    "vc_bi" TEXT NOT NULL,
    "vc_email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "img_perfil" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parentesco" (
    "id" SERIAL NOT NULL,
    "parentesco" TEXT NOT NULL,
    "user1Id" INTEGER NOT NULL,
    "user2Id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Parentesco_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContatoEmergencia" (
    "id" SERIAL NOT NULL,
    "vc_nome" TEXT NOT NULL,
    "vc_telefone" TEXT NOT NULL,
    "parentesco" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ContatoEmergencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seguro" (
    "id" SERIAL NOT NULL,
    "vc_nome" TEXT NOT NULL,
    "fl_preco" DOUBLE PRECISION NOT NULL,
    "txt_descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Seguro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Seguradora" (
    "id" SERIAL NOT NULL,
    "vc_nome" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "txt_descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Seguradora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Parceiro" (
    "id" SERIAL NOT NULL,
    "vc_nome" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "txt_descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Parceiro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Filial" (
    "id" SERIAL NOT NULL,
    "vc_nome" TEXT NOT NULL,
    "vc_telefone" TEXT NOT NULL,
    "fl_lat" DOUBLE PRECISION NOT NULL,
    "fl_lon" DOUBLE PRECISION NOT NULL,
    "bl_central" BOOLEAN NOT NULL,
    "vc_email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "seguradoraId" INTEGER,
    "parceiroId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Filial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servico" (
    "id" SERIAL NOT NULL,
    "vc_nome" TEXT NOT NULL,
    "txt_descricao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Servico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "vc_nome" TEXT NOT NULL,
    "txt_descricao" TEXT NOT NULL,
    "tipo_item" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VeiculoInfo" (
    "id" SERIAL NOT NULL,
    "vc_matricula" TEXT NOT NULL,
    "modelo" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "seguroId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "VeiculoInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Acidente" (
    "id" SERIAL NOT NULL,
    "data_hora" TIMESTAMP(3) NOT NULL,
    "localizacao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "confirmado" BOOLEAN NOT NULL,
    "gravidade" TEXT NOT NULL,
    "itemId" INTEGER NOT NULL,
    "usuarioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Acidente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSeguro" (
    "userId" INTEGER NOT NULL,
    "seguroId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "UserSeguro_pkey" PRIMARY KEY ("userId","seguroId")
);

-- CreateTable
CREATE TABLE "UserSeguradora" (
    "userId" INTEGER NOT NULL,
    "seguradoraId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "UserSeguradora_pkey" PRIMARY KEY ("userId","seguradoraId")
);

-- CreateTable
CREATE TABLE "SeguroSeguradora" (
    "seguroId" INTEGER NOT NULL,
    "seguradoraId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SeguroSeguradora_pkey" PRIMARY KEY ("seguroId","seguradoraId")
);

-- CreateTable
CREATE TABLE "SeguroServico" (
    "seguroId" INTEGER NOT NULL,
    "servicoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SeguroServico_pkey" PRIMARY KEY ("seguroId","servicoId")
);

-- CreateTable
CREATE TABLE "ItemServico" (
    "itemId" INTEGER NOT NULL,
    "servicoId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ItemServico_pkey" PRIMARY KEY ("itemId","servicoId")
);

-- CreateTable
CREATE TABLE "SeguradoraParceiro" (
    "seguradoraId" INTEGER NOT NULL,
    "parceiroId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SeguradoraParceiro_pkey" PRIMARY KEY ("seguradoraId","parceiroId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_vc_email_key" ON "User"("vc_email");

-- CreateIndex
CREATE UNIQUE INDEX "Parentesco_user1Id_user2Id_key" ON "Parentesco"("user1Id", "user2Id");

-- CreateIndex
CREATE UNIQUE INDEX "Filial_vc_email_key" ON "Filial"("vc_email");

-- CreateIndex
CREATE UNIQUE INDEX "VeiculoInfo_itemId_key" ON "VeiculoInfo"("itemId");

-- AddForeignKey
ALTER TABLE "Parentesco" ADD CONSTRAINT "Parentesco_user1Id_fkey" FOREIGN KEY ("user1Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Parentesco" ADD CONSTRAINT "Parentesco_user2Id_fkey" FOREIGN KEY ("user2Id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContatoEmergencia" ADD CONSTRAINT "ContatoEmergencia_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Filial" ADD CONSTRAINT "Filial_seguradoraId_fkey" FOREIGN KEY ("seguradoraId") REFERENCES "Seguradora"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Filial" ADD CONSTRAINT "Filial_parceiroId_fkey" FOREIGN KEY ("parceiroId") REFERENCES "Parceiro"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VeiculoInfo" ADD CONSTRAINT "VeiculoInfo_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VeiculoInfo" ADD CONSTRAINT "VeiculoInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VeiculoInfo" ADD CONSTRAINT "VeiculoInfo_seguroId_fkey" FOREIGN KEY ("seguroId") REFERENCES "Seguro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acidente" ADD CONSTRAINT "Acidente_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Acidente" ADD CONSTRAINT "Acidente_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSeguro" ADD CONSTRAINT "UserSeguro_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSeguro" ADD CONSTRAINT "UserSeguro_seguroId_fkey" FOREIGN KEY ("seguroId") REFERENCES "Seguro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSeguradora" ADD CONSTRAINT "UserSeguradora_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserSeguradora" ADD CONSTRAINT "UserSeguradora_seguradoraId_fkey" FOREIGN KEY ("seguradoraId") REFERENCES "Seguradora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeguroSeguradora" ADD CONSTRAINT "SeguroSeguradora_seguroId_fkey" FOREIGN KEY ("seguroId") REFERENCES "Seguro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeguroSeguradora" ADD CONSTRAINT "SeguroSeguradora_seguradoraId_fkey" FOREIGN KEY ("seguradoraId") REFERENCES "Seguradora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeguroServico" ADD CONSTRAINT "SeguroServico_seguroId_fkey" FOREIGN KEY ("seguroId") REFERENCES "Seguro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeguroServico" ADD CONSTRAINT "SeguroServico_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemServico" ADD CONSTRAINT "ItemServico_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ItemServico" ADD CONSTRAINT "ItemServico_servicoId_fkey" FOREIGN KEY ("servicoId") REFERENCES "Servico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeguradoraParceiro" ADD CONSTRAINT "SeguradoraParceiro_seguradoraId_fkey" FOREIGN KEY ("seguradoraId") REFERENCES "Seguradora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeguradoraParceiro" ADD CONSTRAINT "SeguradoraParceiro_parceiroId_fkey" FOREIGN KEY ("parceiroId") REFERENCES "Parceiro"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
