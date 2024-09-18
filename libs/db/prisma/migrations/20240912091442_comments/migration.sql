/*
  Warnings:

  - You are about to drop the column `post_id` on the `comments` table. All the data in the column will be lost.
  - Added the required column `event_id` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `comments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "comments" DROP CONSTRAINT "comments_post_id_fkey";

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "post_id",
ADD COLUMN     "event_id" TEXT NOT NULL,
ADD COLUMN     "rating" SMALLINT NOT NULL DEFAULT 5,
ADD COLUMN     "user_id" TEXT NOT NULL,
ALTER COLUMN "content" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
