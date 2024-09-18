-- AlterTable
ALTER TABLE "events" ADD COLUMN     "file_id" TEXT;

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "file_id" TEXT;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "file_id" TEXT;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_avatar_url_fkey" FOREIGN KEY ("avatar_url") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE SET NULL ON UPDATE CASCADE;
