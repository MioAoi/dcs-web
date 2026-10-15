/*
  Warnings:

  - You are about to drop the column `userId` on the `Booking` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_userId_fkey";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "BookingUser" (
    "bookingId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "BookingUser_pkey" PRIMARY KEY ("bookingId","userId")
);

-- AddForeignKey
ALTER TABLE "BookingUser" ADD CONSTRAINT "BookingUser_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingUser" ADD CONSTRAINT "BookingUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
