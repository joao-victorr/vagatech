/*
  Warnings:

  - The `vacancyNumber` column on the `Vacancy` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Vacancy" DROP COLUMN "vacancyNumber",
ADD COLUMN     "vacancyNumber" SERIAL NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vacancy_vacancyNumber_key" ON "Vacancy"("vacancyNumber");
