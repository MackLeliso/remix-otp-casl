/*
  Warnings:

  - You are about to drop the column `condition` on the `Permission` table. All the data in the column will be lost.
  - You are about to drop the column `filed` on the `Permission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "condition";
ALTER TABLE "Permission" DROP COLUMN "filed";
ALTER TABLE "Permission" ADD COLUMN     "conditions" JSONB;
ALTER TABLE "Permission" ADD COLUMN     "fields" STRING[];
