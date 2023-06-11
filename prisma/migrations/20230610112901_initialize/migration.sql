-- CreateTable
CREATE TABLE `sessions` (
    `sessionId` VARCHAR(191) NOT NULL,
    `accessToken` VARCHAR(191) NOT NULL,
    `refreshToken` VARCHAR(191) NULL,
    `expiresAt` DATETIME(3) NULL,
    `scope` VARCHAR(191) NULL,
    `pfp` VARCHAR(191) NULL DEFAULT 'https://cdn.discordapp.com/embed/avatars/0.png',
    `accent` VARCHAR(191) NULL,

    UNIQUE INDEX `sessionId`(`sessionId`),
    UNIQUE INDEX `accessToken`(`accessToken`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `licenses` (
    `license_key` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `product` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `licenseKey`(`license_key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `settings` (
    `guildId` VARCHAR(191) NOT NULL,
    `leavemessage` VARCHAR(191) NOT NULL DEFAULT '{"message":"","channel":"false"}',
    `joinmessage` VARCHAR(191) NOT NULL DEFAULT '{"message":"","channel":"false"}',
    `ticketdata` LONGTEXT NOT NULL DEFAULT '{"logChannel": "false","categories": {"open": "false","closed": "false"},"supportRole": "false","message": "false","transcripts": "false"}',
    `membercountchannel` VARCHAR(191) NOT NULL DEFAULT 'false',
    `wishlistchannel` VARCHAR(191) NOT NULL DEFAULT 'false',
    `ticketId` INTEGER NOT NULL DEFAULT 0,

    UNIQUE INDEX `guildId`(`guildId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `levels` (
    `guildId` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL DEFAULT 1,
    `xp` INTEGER NOT NULL DEFAULT 0,
    `xp_needed` INTEGER NOT NULL DEFAULT 66,

    UNIQUE INDEX `Identifier`(`userId`, `guildId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `level_rewards` (
    `guildId` VARCHAR(191) NOT NULL,
    `level` INTEGER NOT NULL,
    `role` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `guildId`(`guildId`),
    UNIQUE INDEX `Identifier`(`guildId`, `level`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ticketdata` (
    `guildId` VARCHAR(191) NOT NULL,
    `id` INTEGER NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `channelID` VARCHAR(191) NOT NULL DEFAULT '',
    `ticketReason` VARCHAR(191) NOT NULL DEFAULT '',
    `open` BOOLEAN NOT NULL DEFAULT true,
    `users` VARCHAR(191) NOT NULL DEFAULT '[]',
    `originalMessage` VARCHAR(191) NOT NULL DEFAULT '',

    UNIQUE INDEX `channelID`(`channelID`),
    UNIQUE INDEX `Identifier`(`guildId`, `id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
