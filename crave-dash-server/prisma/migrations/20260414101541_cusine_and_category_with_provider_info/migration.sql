/*
  Warnings:

  - Added the required column `providerEmail` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `providerEmail` to the `cuisines` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "providerEmail" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "cuisines" ADD COLUMN     "providerEmail" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_providerEmail_fkey" FOREIGN KEY ("providerEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cuisines" ADD CONSTRAINT "cuisines_providerEmail_fkey" FOREIGN KEY ("providerEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
