/*
  Warnings:

  - You are about to drop the column `chapterContentId` on the `Chapter` table. All the data in the column will be lost.
  - You are about to drop the `ChapterContent` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Chapter" DROP CONSTRAINT "Chapter_chapterContentId_fkey";

-- DropIndex
DROP INDEX "Chapter_chapterContentId_key";

-- AlterTable
ALTER TABLE "Chapter" DROP COLUMN "chapterContentId";

-- DropTable
DROP TABLE "ChapterContent";
