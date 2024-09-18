/*
  Warnings:

  - You are about to drop the `File` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "File";

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "type" VARCHAR(64) NOT NULL,
    "original_name" VARCHAR(64) NOT NULL,
    "region" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);
