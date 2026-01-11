/*
  Warnings:

  - You are about to drop the column `courseId` on the `Course` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[courseSlug]` on the table `Course` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `courseSlug` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Course_courseId_key";

-- AlterTable
ALTER TABLE "Course" RENAME COLUMN "courseId" TO "courseSlug";

-- CreateIndex
CREATE UNIQUE INDEX "Course_courseSlug_key" ON "Course"("courseSlug");
