/*
  Warnings:

  - Added the required column `toId` to the `ReactionMessageEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReactionMessageEvent" ADD COLUMN     "toId" DOUBLE PRECISION NOT NULL;

-- AddForeignKey
ALTER TABLE "ReactionMessageEvent" ADD CONSTRAINT "ReactionMessageEvent_toId_fkey" FOREIGN KEY ("toId") REFERENCES "TelegramUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
