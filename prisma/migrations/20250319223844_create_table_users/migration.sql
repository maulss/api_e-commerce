-- CreateTable
CREATE TABLE `users` (
    `user_id` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NULL,
    `email` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `phone_number` VARCHAR(100) NOT NULL,
    `address` VARCHAR(100) NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
