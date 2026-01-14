/*
  Warnings:

  - Added the required column `audioUrl` to the `ChapterSlides` table without a default value. This is not possible if the table is not empty.
  - Added the required column `captions` to the `ChapterSlides` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChapterSlides" ADD COLUMN     "audioUrl" TEXT NOT NULL,
ADD COLUMN     "captions" JSONB NOT NULL;
