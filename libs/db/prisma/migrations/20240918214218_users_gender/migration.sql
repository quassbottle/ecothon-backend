-- CreateEnum
CREATE TYPE "gender" AS ENUM ('male', 'female', 'unknown');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "gender" "gender" NOT NULL DEFAULT 'unknown';
