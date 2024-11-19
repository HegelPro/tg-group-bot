/*
  Warnings:

  - The values [message] on the enum `RegularEventType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RegularEventType_new" AS ENUM ('daily', 'hourly', 'weekly', 'randomly');
ALTER TABLE "RegularEvent" ALTER COLUMN "type" TYPE "RegularEventType_new" USING ("type"::text::"RegularEventType_new");
ALTER TYPE "RegularEventType" RENAME TO "RegularEventType_old";
ALTER TYPE "RegularEventType_new" RENAME TO "RegularEventType";
DROP TYPE "RegularEventType_old";
COMMIT;
