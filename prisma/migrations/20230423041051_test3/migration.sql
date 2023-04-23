/*
  Warnings:

  - You are about to drop the column `title` on the `Internship` table. All the data in the column will be lost.
  - You are about to drop the `Submission` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_internshipId_fkey";

-- DropForeignKey
ALTER TABLE "Submission" DROP CONSTRAINT "Submission_studentId_fkey";

-- AlterTable
ALTER TABLE "Internship" DROP COLUMN "title",
ADD COLUMN     "description" TEXT;

-- DropTable
DROP TABLE "Submission";

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "Tag"("name");
