/*
  Warnings:

  - You are about to drop the column `payemt_method` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `payemt_method`,
    ADD COLUMN `payment_method` VARCHAR(100) NULL;
