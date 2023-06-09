/*
  Warnings:

  - Added the required column `channelID` to the `ticketdata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ticketdata` ADD COLUMN `channelID` VARCHAR(191) NOT NULL;
