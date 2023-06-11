-- AlterTable
ALTER TABLE `settings` MODIFY `joinimage` LONGTEXT NOT NULL DEFAULT '{"backgroundColor":"#0d0d0d","image":"","textColor":"#f0ccfb","shadow":"true","shadowColor":"#7c4b8b"}',
    MODIFY `leaveimage` LONGTEXT NOT NULL DEFAULT '{"backgroundColor":"#0d0d0d","image":"","textColor":"#f0ccfb","shadow":"true","shadowColor":"#7c4b8b"}';
