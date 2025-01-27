/*
  Warnings:

  - You are about to drop the `ReferenceImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ReferenceImage" DROP CONSTRAINT "ReferenceImage_incident_report_id_fkey";

-- DropTable
DROP TABLE "ReferenceImage";

-- CreateTable
CREATE TABLE "ReportFile" (
    "id" SERIAL NOT NULL,
    "file_url" TEXT,
    "incident_report_id" INTEGER,

    CONSTRAINT "ReportFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportFile" ADD CONSTRAINT "ReportFile_incident_report_id_fkey" FOREIGN KEY ("incident_report_id") REFERENCES "IncidentReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
