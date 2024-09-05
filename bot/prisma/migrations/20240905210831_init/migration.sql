-- CreateEnum
CREATE TYPE "TelegramChatType" AS ENUM ('private', 'group', 'supergroup', 'channel');

-- CreateEnum
CREATE TYPE "ReactionType" AS ENUM ('emoji', 'custom_emoji', 'paid');

-- CreateTable
CREATE TABLE "TelegramUser" (
    "id" DOUBLE PRECISION NOT NULL,
    "is_bot" BOOLEAN NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "username" TEXT,
    "language_code" TEXT,
    "is_premium" BOOLEAN,
    "added_to_attachment_menu" BOOLEAN,

    CONSTRAINT "TelegramUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "telegramUserId" DOUBLE PRECISION NOT NULL,
    "reactionScore" DOUBLE PRECISION NOT NULL,
    "clownCounter" DOUBLE PRECISION NOT NULL,
    "chatInfoId" INTEGER,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TelegramChat" (
    "id" DOUBLE PRECISION NOT NULL,
    "first_name" TEXT,
    "is_forum" BOOLEAN,
    "last_name" TEXT,
    "title" TEXT,
    "type" "TelegramChatType" NOT NULL,
    "username" TEXT,

    CONSTRAINT "TelegramChat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MessageEvent" (
    "id" DOUBLE PRECISION NOT NULL,
    "from_id" DOUBLE PRECISION NOT NULL,
    "chat_id" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "text" TEXT,

    CONSTRAINT "MessageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatInfo" (
    "id" SERIAL NOT NULL,
    "telegramChatId" DOUBLE PRECISION NOT NULL,
    "subscribed" BOOLEAN NOT NULL,

    CONSTRAINT "ChatInfo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReactionMessageEvent" (
    "id" SERIAL NOT NULL,
    "chatId" DOUBLE PRECISION NOT NULL,
    "fromId" DOUBLE PRECISION NOT NULL,
    "messageId" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "date" TIMESTAMP(3) NOT NULL,
    "oldReaction" TEXT[],
    "newReaction" TEXT[],
    "different" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ReactionMessageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Global" (
    "id" SERIAL NOT NULL,
    "dailyTimestamp" TIMESTAMP(3) NOT NULL,
    "hourlyTimestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Global_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ChatInfoToMessageEvent" (
    "A" INTEGER NOT NULL,
    "B" DOUBLE PRECISION NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChatInfoToMessageEvent_AB_unique" ON "_ChatInfoToMessageEvent"("A", "B");

-- CreateIndex
CREATE INDEX "_ChatInfoToMessageEvent_B_index" ON "_ChatInfoToMessageEvent"("B");

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_telegramUserId_fkey" FOREIGN KEY ("telegramUserId") REFERENCES "TelegramUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Member" ADD CONSTRAINT "Member_chatInfoId_fkey" FOREIGN KEY ("chatInfoId") REFERENCES "ChatInfo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageEvent" ADD CONSTRAINT "MessageEvent_from_id_fkey" FOREIGN KEY ("from_id") REFERENCES "TelegramUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageEvent" ADD CONSTRAINT "MessageEvent_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "TelegramChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatInfo" ADD CONSTRAINT "ChatInfo_telegramChatId_fkey" FOREIGN KEY ("telegramChatId") REFERENCES "TelegramChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionMessageEvent" ADD CONSTRAINT "ReactionMessageEvent_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "TelegramChat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionMessageEvent" ADD CONSTRAINT "ReactionMessageEvent_fromId_fkey" FOREIGN KEY ("fromId") REFERENCES "TelegramUser"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReactionMessageEvent" ADD CONSTRAINT "ReactionMessageEvent_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "MessageEvent"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatInfoToMessageEvent" ADD CONSTRAINT "_ChatInfoToMessageEvent_A_fkey" FOREIGN KEY ("A") REFERENCES "ChatInfo"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChatInfoToMessageEvent" ADD CONSTRAINT "_ChatInfoToMessageEvent_B_fkey" FOREIGN KEY ("B") REFERENCES "MessageEvent"("id") ON DELETE CASCADE ON UPDATE CASCADE;
