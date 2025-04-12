-- CreateTable
CREATE TABLE `banners` (
    `banner_id` VARCHAR(100) NOT NULL,
    `title` VARCHAR(100) NOT NULL,
    `image_url` TEXT NOT NULL,
    `created_by` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`banner_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `banners` ADD CONSTRAINT `banners_created_by_fkey` FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
