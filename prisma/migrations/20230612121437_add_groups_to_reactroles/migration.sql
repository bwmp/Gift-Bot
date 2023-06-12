/*
  Warnings:

  - A unique constraint covering the columns `[guildId,group]` on the table `reactionroles` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `group` to the `reactionroles` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Identifier` ON `reactionroles`;

-- AlterTable
ALTER TABLE `reactionroles` ADD COLUMN `group` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Identifier` ON `reactionroles`(`guildId`, `group`);
