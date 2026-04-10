-- CreateEnum
CREATE TYPE "MealAvailabilityStatus" AS ENUM ('AVAILABLE', 'UNAVAILABLE');

-- CreateEnum
CREATE TYPE "MealType" AS ENUM ('BREAKFAST', 'LUNCH', 'DINNER');

-- CreateEnum
CREATE TYPE "DietaryTag" AS ENUM ('VEG', 'NON_VEG', 'VEGAN');

-- CreateEnum
CREATE TYPE "SpiceLevel" AS ENUM ('MILD', 'MEDIUM', 'HOT', 'EXTRA_HOT');

-- CreateTable
CREATE TABLE "meals" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "image" TEXT,
    "images" TEXT[],
    "availabilityStatus" "MealAvailabilityStatus" NOT NULL DEFAULT 'AVAILABLE',
    "preparationTime" INTEGER,
    "servingSize" INTEGER,
    "mealType" "MealType" NOT NULL,
    "dietaryTag" "DietaryTag" NOT NULL,
    "spiceLevel" "SpiceLevel" NOT NULL,
    "ingredients" TEXT[],
    "discount" DECIMAL(10,2),
    "stockQuantity" INTEGER NOT NULL DEFAULT 0,
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "videoUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "meals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "meals_categoryId_idx" ON "meals"("categoryId");

-- AddForeignKey
ALTER TABLE "meals" ADD CONSTRAINT "meals_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;
