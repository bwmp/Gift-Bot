/*
  Warnings:

  - A unique constraint covering the columns `[channelID]` on the table `ticketdata` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `channelID` ON `ticketdata`(`channelID`);
