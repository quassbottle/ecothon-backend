-- CreateTable
CREATE TABLE "user_telegram" (
    "userId" TEXT NOT NULL,
    "telegram_id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "telegram_hash" TEXT NOT NULL,
    "telegram_username" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "user_telegram_userId_key" ON "user_telegram"("userId");

-- AddForeignKey
ALTER TABLE "user_telegram" ADD CONSTRAINT "user_telegram_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
