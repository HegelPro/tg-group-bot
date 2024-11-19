/*
  Warnings:

  - You are about to drop the `Global` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "RegularEventType" AS ENUM ('message');

-- DropTable
DROP TABLE "Global";

-- CreateTable
CREATE TABLE "RegularEvent" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3),
    "nextDate" TIMESTAMP(3) NOT NULL,
    "destroyDate" TIMESTAMP(3),
    "type" "RegularEventType" NOT NULL,
    "text" TEXT,
    "video" TEXT,

    CONSTRAINT "RegularEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MoneyTransfer" (
    "id" SERIAL NOT NULL,
    "chatId" DOUBLE PRECISION NOT NULL,
    "fromUserId" DOUBLE PRECISION,
    "value" DOUBLE PRECISION NOT NULL,
    "toUserId" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "MoneyTransfer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MoneyTransfer" ADD CONSTRAINT "MoneyTransfer_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "TelegramChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyTransfer" ADD CONSTRAINT "MoneyTransfer_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "TelegramUser"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoneyTransfer" ADD CONSTRAINT "MoneyTransfer_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "TelegramUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
