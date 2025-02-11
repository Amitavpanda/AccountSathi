/*
  Warnings:

  - You are about to drop the `HotelUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Store` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Admins` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_Staffs` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_superAdminId_fkey";

-- DropForeignKey
ALTER TABLE "_Admins" DROP CONSTRAINT "_Admins_A_fkey";

-- DropForeignKey
ALTER TABLE "_Admins" DROP CONSTRAINT "_Admins_B_fkey";

-- DropForeignKey
ALTER TABLE "_Staffs" DROP CONSTRAINT "_Staffs_A_fkey";

-- DropForeignKey
ALTER TABLE "_Staffs" DROP CONSTRAINT "_Staffs_B_fkey";

-- AlterTable
ALTER TABLE "SalesInfoDetail" ADD COLUMN     "extraAmount" DOUBLE PRECISION,
ADD COLUMN     "extraAmountDescription" TEXT;

-- DropTable
DROP TABLE "HotelUser";

-- DropTable
DROP TABLE "Store";

-- DropTable
DROP TABLE "_Admins";

-- DropTable
DROP TABLE "_Staffs";

-- DropEnum
DROP TYPE "Role";
