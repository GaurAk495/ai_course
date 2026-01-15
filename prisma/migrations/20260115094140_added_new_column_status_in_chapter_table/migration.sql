-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Pending', 'InProgress', 'Error', 'Generated');

-- AlterTable
ALTER TABLE "Chapter" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'Pending';
