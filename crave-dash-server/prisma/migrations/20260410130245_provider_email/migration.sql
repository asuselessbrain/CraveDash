-- AlterTable
ALTER TABLE "meals" ADD COLUMN     "providerEmail" TEXT NOT NULL DEFAULT 'arfan@gmail.com';

-- AddForeignKey
ALTER TABLE "meals" ADD CONSTRAINT "meals_providerEmail_fkey" FOREIGN KEY ("providerEmail") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
