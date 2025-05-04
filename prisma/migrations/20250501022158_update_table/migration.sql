/*
  Warnings:

  - You are about to alter the column `order_id` on the `order_items` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to alter the column `product_id` on the `order_items` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to drop the column `order_status` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `orders` table. All the data in the column will be lost.
  - You are about to alter the column `user_id` on the `orders` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(100)`.
  - You are about to drop the `payments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `order_items` DROP FOREIGN KEY `order_items_order_id_fkey`;

-- DropForeignKey
ALTER TABLE `order_items` DROP FOREIGN KEY `order_items_product_id_fkey`;

-- DropForeignKey
ALTER TABLE `orders` DROP FOREIGN KEY `orders_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `payments` DROP FOREIGN KEY `payments_order_id_fkey`;

-- DropIndex
DROP INDEX `order_items_order_id_fkey` ON `order_items`;

-- DropIndex
DROP INDEX `order_items_product_id_fkey` ON `order_items`;

-- DropIndex
DROP INDEX `orders_user_id_fkey` ON `orders`;

-- AlterTable
ALTER TABLE `order_items` MODIFY `order_id` VARCHAR(100) NOT NULL,
    MODIFY `product_id` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `orders` DROP COLUMN `order_status`,
    DROP COLUMN `updated_at`,
    ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'waiting_payment',
    MODIFY `user_id` VARCHAR(100) NOT NULL;

-- DropTable
DROP TABLE `payments`;

-- AddForeignKey
ALTER TABLE `orders` ADD CONSTRAINT `orders_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `orders`(`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_items` ADD CONSTRAINT `order_items_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
