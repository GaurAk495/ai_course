-- CreateTable
CREATE TABLE "ChapterSlides" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "slideSlug" TEXT NOT NULL,
    "slideIndex" INTEGER NOT NULL,
    "audioFileName" TEXT NOT NULL,
    "narration" JSONB NOT NULL,
    "html" TEXT NOT NULL,
    "revelData" JSONB NOT NULL,
    "chapterId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChapterSlides_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChapterSlides_slideSlug_key" ON "ChapterSlides"("slideSlug");

-- AddForeignKey
ALTER TABLE "ChapterSlides" ADD CONSTRAINT "ChapterSlides_chapterId_fkey" FOREIGN KEY ("chapterId") REFERENCES "Chapter"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
