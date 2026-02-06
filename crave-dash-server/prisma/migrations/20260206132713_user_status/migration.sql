-- CreateEnum
CREATE TYPE "CustomerStatus" AS ENUM ('ACTIVE', 'SUSPENDED');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "status" "CustomerStatus" NOT NULL DEFAULT 'ACTIVE';
