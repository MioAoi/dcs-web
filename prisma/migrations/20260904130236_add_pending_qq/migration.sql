/*
  Warnings:

  - A unique constraint covering the columns `[pendingQqid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "pendingQqid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_pendingQqid_key" ON "User"("pendingQqid");
