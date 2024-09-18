-- CreateEnum
CREATE TYPE "DocumentTypes" AS ENUM ('unverified', 'verified');

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "organization_name" TEXT NOT NULL,
    "tax_id" TEXT NOT NULL,
    "ogrn" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "email_organization" TEXT NOT NULL,
    "activity_code" TEXT NOT NULL,
    "document_type" "DocumentTypes" NOT NULL,
    "user_id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "documents_user_id_key" ON "documents"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "documents_file_id_key" ON "documents"("file_id");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
