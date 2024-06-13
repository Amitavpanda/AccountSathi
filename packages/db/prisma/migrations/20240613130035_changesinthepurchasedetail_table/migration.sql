/*
  Warnings:

  - Added the required column `supplierPurchaseId` to the `SupplierPurchaseDetail` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "SupplierPurchaseDetail" DROP CONSTRAINT "SupplierPurchaseDetail_id_fkey";

-- DropIndex
DROP INDEX "SupplierPurchaseDetail_id_idx";

-- AlterTable
ALTER TABLE "SupplierPurchaseDetail" ADD COLUMN     "supplierPurchaseId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "SupplierPurchaseDetail_supplierPurchaseId_idx" ON "SupplierPurchaseDetail"("supplierPurchaseId");

-- AddForeignKey
ALTER TABLE "SupplierPurchaseDetail" ADD CONSTRAINT "SupplierPurchaseDetail_supplierPurchaseId_fkey" FOREIGN KEY ("supplierPurchaseId") REFERENCES "SupplierPurchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
