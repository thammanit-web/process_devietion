/*
  Warnings:

  - The `target_finish` column on the `ProblemSolution` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "ProblemSolution" DROP COLUMN "target_finish",
ADD COLUMN     "target_finish" TIMESTAMP(3);
