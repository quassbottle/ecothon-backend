-- CreateEnum
CREATE TYPE "event_notification_type" AS ENUM ('WEEKLY');

-- CreateTable
CREATE TABLE "event_notifications" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "type" "event_notification_type" NOT NULL,

    CONSTRAINT "event_notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "event_notifications" ADD CONSTRAINT "event_notifications_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
