/*
  Warnings:

  - A unique constraint covering the columns `[chapterContentId]` on the table `Chapter` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "chapterContentId" TEXT;

-- CreateTable
CREATE TABLE "ChapterContent" (
    "id" TEXT NOT NULL,
    "videoContent" JSONB NOT NULL,
    "captions" JSONB NOT NULL,
    "audioFileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChapterContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Chapter_chapterContentId_key" ON "Chapter"("chapterContentId");

-- AddForeignKey
ALTER TABLE "Chapter" ADD CONSTRAINT "Chapter_chapterContentId_fkey" FOREIGN KEY ("chapterContentId") REFERENCES "ChapterContent"("id") ON DELETE SET NULL ON UPDATE CASCADE;
