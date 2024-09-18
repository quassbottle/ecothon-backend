-- AlterTable
ALTER TABLE "tags" ADD COLUMN     "usersId" TEXT;

-- CreateTable
CREATE TABLE "_UserInterestingTags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserInterestingTags_AB_unique" ON "_UserInterestingTags"("A", "B");

-- CreateIndex
CREATE INDEX "_UserInterestingTags_B_index" ON "_UserInterestingTags"("B");

-- AddForeignKey
ALTER TABLE "_UserInterestingTags" ADD CONSTRAINT "_UserInterestingTags_A_fkey" FOREIGN KEY ("A") REFERENCES "tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserInterestingTags" ADD CONSTRAINT "_UserInterestingTags_B_fkey" FOREIGN KEY ("B") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
