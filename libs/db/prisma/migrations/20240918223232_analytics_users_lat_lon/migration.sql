/*
  Warnings:

  - You are about to drop the column `user_location` on the `event_analytics_events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "event_analytics_events" DROP COLUMN "user_location",
ADD COLUMN     "event_age_rating" "age_rating",
ADD COLUMN     "user_latitude" DOUBLE PRECISION,
ADD COLUMN     "user_longitude" DOUBLE PRECISION;
