/*
  Warnings:

  - The `incident_date` column on the `IncidentReport` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `report_date` column on the `IncidentReport` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "IncidentReport" DROP COLUMN "incident_date",
ADD COLUMN     "incident_date" TIMESTAMP(3),
DROP COLUMN "report_date",
ADD COLUMN     "report_date" TIMESTAMP(3);
