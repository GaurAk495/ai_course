/*
  Warnings:

  - You are about to drop the column `chapterId` on the `Chapter` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[chapterSlug]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `chapterSlug` to the `Chapter` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Chapter_chapterId_key";

-- AlterTable
ALTER TABLE "Chapter" RENAME COLUMN "chapterId" TO "chapterSlug";

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_chapterSlug_key" ON "Chapter"("chapterSlug");
