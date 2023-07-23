/*
  Warnings:

  - A unique constraint covering the columns `[hwid,product]` on the table `licenses` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,product]` on the table `licenses` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `licenses` ADD COLUMN `bypass` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `hwid` VARCHAR(191) NOT NULL DEFAULT 'none';

-- AlterTable
ALTER TABLE `settings` ADD COLUMN `counting` LONGTEXT NOT NULL DEFAULT '{"channel": "false","countnumber": "0","countmax": "0"}';

-- CreateIndex
CREATE UNIQUE INDEX `Identifier2` ON `licenses`(`hwid`, `product`);

-- CreateIndex
CREATE UNIQUE INDEX `Identifier3` ON `licenses`(`userId`, `product`);

-- RedefineIndex
CREATE UNIQUE INDEX `licenses_license_key_key` ON `licenses`(`license_key`);
DROP INDEX `licenseKey` ON `licenses`;
