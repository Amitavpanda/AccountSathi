-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "name" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

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
    "supplierPurchaseId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SupplierPurchaseDetail_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesInfo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "propieder" TEXT NOT NULL,
    "totalAmountDue" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "SalesInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalesInfoDetail" (
    "id" TEXT NOT NULL,
    "stockName" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "totalAmountDue" DOUBLE PRECISION NOT NULL,
    "amountPaid" DOUBLE PRECISION NOT NULL,
    "amountPaidDescription" TEXT NOT NULL,
    "salesInfoId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SalesInfoDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierPurchase_id_key" ON "SupplierPurchase"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SupplierPurchaseDetail_id_key" ON "SupplierPurchaseDetail"("id");

-- CreateIndex
CREATE INDEX "SupplierPurchaseDetail_supplierPurchaseId_idx" ON "SupplierPurchaseDetail"("supplierPurchaseId");

-- CreateIndex
CREATE UNIQUE INDEX "SalesInfo_id_key" ON "SalesInfo"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SalesInfoDetail_id_key" ON "SalesInfoDetail"("id");

-- CreateIndex
CREATE INDEX "SalesInfoDetail_salesInfoId_idx" ON "SalesInfoDetail"("salesInfoId");

-- AddForeignKey
ALTER TABLE "SupplierPurchaseDetail" ADD CONSTRAINT "SupplierPurchaseDetail_supplierPurchaseId_fkey" FOREIGN KEY ("supplierPurchaseId") REFERENCES "SupplierPurchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalesInfoDetail" ADD CONSTRAINT "SalesInfoDetail_salesInfoId_fkey" FOREIGN KEY ("salesInfoId") REFERENCES "SalesInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
