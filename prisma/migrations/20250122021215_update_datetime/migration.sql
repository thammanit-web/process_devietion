/*
  Warnings:

  - The `scheduled_date` column on the `InvestigationMeeting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `meeting_date` column on the `InvestigationMeeting` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `finish_date` column on the `TroubleshootSolution` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "IncidentReport" ALTER COLUMN "incident_date" DROP DEFAULT;

-- AlterTable
ALTER TABLE "InvestigationMeeting" DROP COLUMN "scheduled_date",
ADD COLUMN     "scheduled_date" TIMESTAMP(3),
DROP COLUMN "meeting_date",
ADD COLUMN     "meeting_date" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "TroubleshootSolution" DROP COLUMN "finish_date",
ADD COLUMN     "finish_date" TIMESTAMP(3);
