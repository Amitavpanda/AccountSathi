-- AlterTable
ALTER TABLE "SalesInfo" ADD COLUMN     "accountDetails" TEXT,
ADD COLUMN     "additionalDetails" TEXT;

-- AlterTable
ALTER TABLE "SalesInfoDetail" ADD COLUMN     "additonalDetails1" TEXT,
ADD COLUMN     "additonalDetails2" TEXT,
ADD COLUMN     "priceDetails" TEXT,
ADD COLUMN     "quantityDetails" TEXT,
ADD COLUMN     "quantityType" TEXT,
ADD COLUMN     "stockNameDetails" TEXT;

-- AlterTable
ALTER TABLE "SupplierPurchase" ADD COLUMN     "accountDetails" TEXT,
ADD COLUMN     "additionalDetails" TEXT;

-- AlterTable
ALTER TABLE "SupplierPurchaseDetail" ADD COLUMN     "additionalDetails1" TEXT,
ADD COLUMN     "additionalDetails2" TEXT,
ADD COLUMN     "priceDetails" TEXT,
ADD COLUMN     "quantityDetails" TEXT,
ADD COLUMN     "quantityType" TEXT,
ADD COLUMN     "stockNameDetails" TEXT;
