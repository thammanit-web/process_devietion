/*
  Warnings:

  - You are about to drop the column `incident_report_id` on the `ProblemSolution` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProblemSolution" DROP CONSTRAINT "ProblemSolution_incident_report_id_fkey";

-- AlterTable
ALTER TABLE "ProblemSolution" DROP COLUMN "incident_report_id";
