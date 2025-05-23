/*
  Warnings:

  - The primary key for the `Apolice` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Apolice` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `referenciaId` column on the `Notificacao` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `apoliceId` on the `Pagamento` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Pagamento" DROP CONSTRAINT "Pagamento_apoliceId_fkey";

-- AlterTable
ALTER TABLE "Apolice" DROP CONSTRAINT "Apolice_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Apolice_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Notificacao" DROP COLUMN "referenciaId",
ADD COLUMN     "referenciaId" INTEGER;

-- AlterTable
ALTER TABLE "Pagamento" DROP COLUMN "apoliceId",
ADD COLUMN     "apoliceId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_apoliceId_fkey" FOREIGN KEY ("apoliceId") REFERENCES "Apolice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
