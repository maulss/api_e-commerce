/*
  Warnings:

  - Added the required column `isFeatured` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isNew` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `products` ADD COLUMN `isFeatured` BOOLEAN NOT NULL,
    ADD COLUMN `isNew` BOOLEAN NOT NULL;
