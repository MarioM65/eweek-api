/*
  Warnings:

  - A unique constraint covering the columns `[vc_email]` on the table `ContatoEmergencia` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "ContatoEmergencia" ADD COLUMN     "vc_email" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "ContatoEmergencia_vc_email_key" ON "ContatoEmergencia"("vc_email");
