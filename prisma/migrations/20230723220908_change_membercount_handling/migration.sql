/*
  Warnings:

  - You are about to drop the column `membercountchannel` on the `settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `settings` DROP COLUMN `membercountchannel`,
    ADD COLUMN `membercount` VARCHAR(191) NOT NULL DEFAULT '{"channel": "false","text": "Members: {COUNT}"}';

-- RedefineIndex
CREATE UNIQUE INDEX `Identifier1` ON `licenses`(`hwid`, `product`);
DROP INDEX `Identifier2` ON `licenses`;

-- RedefineIndex
CREATE UNIQUE INDEX `Identifier2` ON `licenses`(`userId`, `product`);
DROP INDEX `Identifier3` ON `licenses`;
