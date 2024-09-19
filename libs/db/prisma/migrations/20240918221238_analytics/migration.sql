-- CreateEnum
CREATE TYPE "event_types" AS ENUM ('attend', 'unattend', 'favorite', 'unfavorite', 'comment');

-- CreateTable
CREATE TABLE "event_analytics_events" (
    "id" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "user_birthdate" TIMESTAMP(3),
    "user_gender" "gender",
    "user_location" TEXT,
    "event_type" "event_types",
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_analytics_events_pkey" PRIMARY KEY ("id")
);
