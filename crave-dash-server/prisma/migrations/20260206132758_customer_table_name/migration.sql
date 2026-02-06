/*
  Warnings:

  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_email_fkey";

-- DropTable
DROP TABLE "Customer";

-- CreateTable
CREATE TABLE "customers" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "profileImage" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zipCode" TEXT,
    "status" "CustomerStatus" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "customers_email_key" ON "customers"("email");

-- AddForeignKey
ALTER TABLE "customers" ADD CONSTRAINT "customers_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE CASCADE ON UPDATE CASCADE;
