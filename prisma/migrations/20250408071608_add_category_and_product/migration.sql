-- CreateTable
CREATE TABLE `categories` (
    `category_id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,

    UNIQUE INDEX `categories_name_key`(`name`),
    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `product_id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `description` TEXT NULL,
    `price` INTEGER NOT NULL,
    `stock` INTEGER NOT NULL,
    `image_url` TEXT NULL,
    `category_id` VARCHAR(191) NOT NULL,
    `created_by_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_created_by_id_fkey` FOREIGN KEY (`created_by_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
