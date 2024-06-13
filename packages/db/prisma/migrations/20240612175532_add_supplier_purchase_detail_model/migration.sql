-- CreateTable
CREATE TABLE "SupplierPurchaseDetail" (
    "id" TEXT NOT NULL,
    "stockName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "totalAmountDue" DOUBLE PRECISION NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "amountPaidDescription" TEXT NOT NULL,

    CONSTRAINT "SupplierPurchaseDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SupplierPurchaseDetail_id_key" ON "SupplierPurchaseDetail"("id");

-- CreateIndex
CREATE INDEX "SupplierPurchaseDetail_id_idx" ON "SupplierPurchaseDetail"("id");

-- AddForeignKey
ALTER TABLE "SupplierPurchaseDetail" ADD CONSTRAINT "SupplierPurchaseDetail_id_fkey" FOREIGN KEY ("id") REFERENCES "SupplierPurchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
