-- AlterTable
ALTER TABLE `settings` ADD COLUMN `joinimage` LONGTEXT NOT NULL DEFAULT '{"backgroundColor":"#0d0d0d","image":"","textcolor":"#f0ccfb","shadow":"true","shadowcolor":"#7c4b8b"}',
    ADD COLUMN `leaveimage` LONGTEXT NOT NULL DEFAULT '{"backgroundColor":"#0d0d0d","image":"","textcolor":"#f0ccfb","shadow":"true","shadowcolor":"#7c4b8b"}';
