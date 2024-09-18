/*
  Warnings:

  - You are about to drop the column `userId` on the `user_telegram` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[user_id]` on the table `user_telegram` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `user_id` to the `user_telegram` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "user_telegram" DROP CONSTRAINT "user_telegram_userId_fkey";

-- DropIndex
DROP INDEX "user_telegram_userId_key";

-- AlterTable
ALTER TABLE "user_telegram" DROP COLUMN "userId",
ADD COLUMN     "user_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_telegram_user_id_key" ON "user_telegram"("user_id");

-- AddForeignKey
ALTER TABLE "user_telegram" ADD CONSTRAINT "user_telegram_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
