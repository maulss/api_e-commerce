/*
  Warnings:

  - You are about to drop the column `payment_method` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `payment_method`,
    ADD COLUMN `contract_address` VARCHAR(100) NULL,
    ADD COLUMN `transaction_hash` VARCHAR(100) NULL;
