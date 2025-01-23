-- AlterTable
ALTER TABLE "IncidentReport" ALTER COLUMN "incident_date" SET DATA TYPE TEXT,
ALTER COLUMN "report_date" DROP DEFAULT,
ALTER COLUMN "report_date" SET DATA TYPE TEXT;
