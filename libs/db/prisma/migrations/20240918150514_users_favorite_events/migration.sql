/*
  Warnings:

  - Added the required column `eventsId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "eventsId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_UserEventsFavorite" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserEventsFavorite_AB_unique" ON "_UserEventsFavorite"("A", "B");

-- CreateIndex
CREATE INDEX "_UserEventsFavorite_B_index" ON "_UserEventsFavorite"("B");

-- AddForeignKey
ALTER TABLE "_UserEventsFavorite" ADD CONSTRAINT "_UserEventsFavorite_A_fkey" FOREIGN KEY ("A") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserEventsFavorite" ADD CONSTRAINT "_UserEventsFavorite_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
