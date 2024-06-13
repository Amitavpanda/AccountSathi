-- CreateTable
CREATE TABLE "SupplierPurchase" (
    "id" TEXT NOT NULL,
    "nameOfTheSupplier" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "totalAmountDue" DOUBLE PRECISION NOT NULL,
    "listOfItems" TEXT[],

    CONSTRAINT "SupplierPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SupplierPurchase_id_key" ON "SupplierPurchase"("id");
