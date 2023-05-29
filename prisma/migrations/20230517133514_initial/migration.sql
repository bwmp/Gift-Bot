-- CreateTable
CREATE TABLE `licenses` (
    `license_key` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `product` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `licenseKey`(`license_key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `blacklist` (
    `userId` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `userId`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `levels` (
    `userId` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL DEFAULT 1,
    `xp` INTEGER NOT NULL DEFAULT 0,
    `xp_needed` INTEGER NOT NULL DEFAULT 66,

    UNIQUE INDEX `userId`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
