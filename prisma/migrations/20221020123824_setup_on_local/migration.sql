/*
  Warnings:

  - Added the required column `updatedAt` to the `Comment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Comment" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "Otp" (
    "id" STRING NOT NULL,
    "otpNumber" STRING NOT NULL,
    "phone" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Otp_otpNumber_key" ON "Otp"("otpNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Otp_phone_key" ON "Otp"("phone");
