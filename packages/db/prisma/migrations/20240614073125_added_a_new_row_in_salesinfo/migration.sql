/*
  Warnings:

  - Added the required column `propieder` to the `SalesInfo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SalesInfo" ADD COLUMN     "propieder" TEXT NOT NULL;
