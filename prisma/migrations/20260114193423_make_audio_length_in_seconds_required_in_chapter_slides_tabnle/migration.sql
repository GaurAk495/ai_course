/*
  Warnings:

  - Made the column `audioLengthInSeconds` on table `ChapterSlides` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ChapterSlides" ALTER COLUMN "audioLengthInSeconds" SET NOT NULL;
