/*
  Warnings:

  - You are about to alter the column `payemt_method` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `orders` MODIFY `payemt_method` VARCHAR(100) NULL;
