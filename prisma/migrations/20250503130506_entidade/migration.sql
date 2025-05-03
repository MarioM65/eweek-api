-- CreateTable
CREATE TABLE "Entidade" (
    "id" SERIAL NOT NULL,
    "vc_email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "vc_telefone" TEXT NOT NULL,
    "filialId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Entidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntidadeToken" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "entidadeId" INTEGER NOT NULL,
    "lastUsed" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntidadeToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Entidade_vc_email_key" ON "Entidade"("vc_email");

-- CreateIndex
CREATE UNIQUE INDEX "Entidade_filialId_key" ON "Entidade"("filialId");

-- CreateIndex
CREATE UNIQUE INDEX "EntidadeToken_token_key" ON "EntidadeToken"("token");

-- CreateIndex
CREATE INDEX "EntidadeToken_token_idx" ON "EntidadeToken"("token");

-- CreateIndex
CREATE INDEX "EntidadeToken_entidadeId_idx" ON "EntidadeToken"("entidadeId");

-- AddForeignKey
ALTER TABLE "Entidade" ADD CONSTRAINT "Entidade_filialId_fkey" FOREIGN KEY ("filialId") REFERENCES "Filial"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntidadeToken" ADD CONSTRAINT "EntidadeToken_entidadeId_fkey" FOREIGN KEY ("entidadeId") REFERENCES "Entidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
