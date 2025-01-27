-- AlterTable
ALTER TABLE "ProblemSolution" ADD COLUMN     "incident_report_id" INTEGER;

-- AddForeignKey
ALTER TABLE "ProblemSolution" ADD CONSTRAINT "ProblemSolution_incident_report_id_fkey" FOREIGN KEY ("incident_report_id") REFERENCES "IncidentReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
