/*
  Warnings:

  - Added the required column `fullText` to the `ChapterSlides` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subtitle` to the `ChapterSlides` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `ChapterSlides` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChapterSlides" ADD COLUMN     "fullText" TEXT NOT NULL,
ADD COLUMN     "subtitle" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
