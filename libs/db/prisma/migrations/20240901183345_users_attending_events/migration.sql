-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_url" TEXT;

-- CreateTable
CREATE TABLE "_UserEventsAttending" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserEventsAttending_AB_unique" ON "_UserEventsAttending"("A", "B");

-- CreateIndex
CREATE INDEX "_UserEventsAttending_B_index" ON "_UserEventsAttending"("B");

-- AddForeignKey
ALTER TABLE "_UserEventsAttending" ADD CONSTRAINT "_UserEventsAttending_A_fkey" FOREIGN KEY ("A") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserEventsAttending" ADD CONSTRAINT "_UserEventsAttending_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
