-- AlterTable
ALTER TABLE "users" ADD COLUMN     "first_name" TEXT,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "middle_name" TEXT,
ADD COLUMN     "trees" INTEGER NOT NULL DEFAULT 0;
