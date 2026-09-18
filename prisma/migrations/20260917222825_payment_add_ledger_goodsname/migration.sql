/*
  Warnings:

  - A unique constraint covering the columns `[paymentOrderId]` on the table `Ledger` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `goodsName` to the `PaymentOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Ledger" ADD COLUMN     "paymentOrderId" INTEGER;

-- AlterTable
ALTER TABLE "PaymentOrder" ADD COLUMN     "goodsName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Ledger_paymentOrderId_key" ON "Ledger"("paymentOrderId");

-- AddForeignKey
ALTER TABLE "Ledger" ADD CONSTRAINT "Ledger_paymentOrderId_fkey" FOREIGN KEY ("paymentOrderId") REFERENCES "PaymentOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
