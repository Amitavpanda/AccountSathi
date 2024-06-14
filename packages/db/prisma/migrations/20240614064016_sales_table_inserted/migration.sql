-- CreateTable
CREATE TABLE "SalesInfo" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "address" TEXT NOT NULL,
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

    CONSTRAINT "SalesInfoDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SalesInfo_id_key" ON "SalesInfo"("id");

-- CreateIndex
CREATE UNIQUE INDEX "SalesInfoDetail_id_key" ON "SalesInfoDetail"("id");

-- CreateIndex
CREATE INDEX "SalesInfoDetail_salesInfoId_idx" ON "SalesInfoDetail"("salesInfoId");

-- AddForeignKey
ALTER TABLE "SalesInfoDetail" ADD CONSTRAINT "SalesInfoDetail_salesInfoId_fkey" FOREIGN KEY ("salesInfoId") REFERENCES "SalesInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
