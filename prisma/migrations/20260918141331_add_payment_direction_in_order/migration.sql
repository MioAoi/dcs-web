/*
  Warnings:

  - Added the required column `amount` to the `Coupon` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Coupon" ADD COLUMN     "amount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PaymentOrder" ADD COLUMN     "bill" TEXT,
ADD COLUMN     "payDirection" TEXT;
