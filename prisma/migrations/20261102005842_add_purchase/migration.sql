/*
  Warnings:

  - A unique constraint covering the columns `[purchaseId]` on the table `Ledger` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "LedgerEntryType" ADD VALUE 'SHOP';

-- AlterTable
ALTER TABLE "Ledger" ADD COLUMN     "purchaseId" INTEGER;

-- CreateTable
CREATE TABLE "Purchase" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "goodsName" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ledger_purchaseId_key" ON "Ledger"("purchaseId");

-- AddForeignKey
ALTER TABLE "Ledger" ADD CONSTRAINT "Ledger_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
