/*
  Warnings:

  - You are about to drop the column `cart_id` on the `cart_items` table. All the data in the column will be lost.
  - You are about to drop the `carts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `cart_items` DROP FOREIGN KEY `cart_items_cart_id_fkey`;

-- DropForeignKey
ALTER TABLE `carts` DROP FOREIGN KEY `carts_user_id_fkey`;

-- DropIndex
DROP INDEX `cart_items_cart_id_fkey` ON `cart_items`;

-- AlterTable
ALTER TABLE `cart_items` DROP COLUMN `cart_id`;

-- DropTable
DROP TABLE `carts`;

-- AddForeignKey
ALTER TABLE `cart_items` ADD CONSTRAINT `cart_items_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
