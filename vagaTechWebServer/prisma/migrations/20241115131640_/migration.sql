/*
  Warnings:

  - You are about to drop the column `placa` on the `Vehicle` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[plate]` on the table `Vehicle` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `plate` to the `Vehicle` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Vehicle_placa_key";

-- AlterTable
ALTER TABLE "Vehicle" DROP COLUMN "placa",
ADD COLUMN     "plate" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plate_key" ON "Vehicle"("plate");
