-- DropForeignKey
ALTER TABLE "ChapterSlides" DROP CONSTRAINT "ChapterSlides_chapterId_fkey";

-- AddForeignKey
ALTER TABLE "ChapterSlides" ADD CONSTRAINT "ChapterSlides_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
