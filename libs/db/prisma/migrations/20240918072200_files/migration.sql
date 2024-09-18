-- CreateTable
CREATE TABLE "File" (
    "id" TEXT NOT NULL,
    "type" VARCHAR(64) NOT NULL,
    "original_name" VARCHAR(64) NOT NULL,
    "region" TEXT NOT NULL,
    "bucket" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);
