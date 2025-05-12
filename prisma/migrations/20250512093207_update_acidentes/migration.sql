-- AlterTable
ALTER TABLE "Acidente" ADD COLUMN     "atendido" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "confirmado" SET DEFAULT false;
