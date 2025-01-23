-- CreateTable
CREATE TABLE "Employee" (
    "id" SERIAL NOT NULL,
    "employee_name" TEXT NOT NULL,
    "employee_email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IncidentReport" (
    "id" SERIAL NOT NULL,
    "ref_no" TEXT NOT NULL,
    "priority" TEXT,
    "topic" TEXT,
    "category_report" TEXT,
    "machine_code" TEXT,
    "machine_name" TEXT,
    "incident_date" TIMESTAMP(3),
    "incident_time" TEXT,
    "incident_description" TEXT,
    "total_time" TEXT,
    "summary_incident" TEXT,
    "reporter_name" TEXT,
    "report_date" TIMESTAMP(3),
    "status_report" TEXT,
    "head_approve" TEXT,

    CONSTRAINT "IncidentReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferenceImage" (
    "id" SERIAL NOT NULL,
    "image_url" TEXT,
    "incident_report_id" INTEGER,

    CONSTRAINT "ReferenceImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InvestigationMeeting" (
    "id" SERIAL NOT NULL,
    "incident_report_id" INTEGER,
    "topic_meeting" TEXT,
    "scheduled_date" TEXT,
    "meeting_date" TEXT,
    "summary_meeting" TEXT,
    "investigation_signature" TEXT,
    "manager_approve" BOOLEAN,
    "file_meeting" TEXT,

    CONSTRAINT "InvestigationMeeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProblemSolution" (
    "id" SERIAL NOT NULL,
    "meeting_id" INTEGER,
    "topic_solution" TEXT NOT NULL,
    "assign_to" TEXT,
    "target_finish" TEXT,
    "status_solution" TEXT,
    "manager_approve" BOOLEAN,

    CONSTRAINT "ProblemSolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TroubleshootSolution" (
    "id" SERIAL NOT NULL,
    "solution_id" INTEGER NOT NULL,
    "result_troubleshoot" TEXT,
    "file_summary" TEXT,
    "finish_date" TEXT,

    CONSTRAINT "TroubleshootSolution_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ManagerApprove" (
    "id" SERIAL NOT NULL,
    "meeting_id" INTEGER,
    "solution_id" INTEGER,
    "comment_solution" TEXT,
    "comment_troubleshoot" TEXT,

    CONSTRAINT "ManagerApprove_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_employee_email_key" ON "Employee"("employee_email");

-- AddForeignKey
ALTER TABLE "ReferenceImage" ADD CONSTRAINT "ReferenceImage_incident_report_id_fkey" FOREIGN KEY ("incident_report_id") REFERENCES "IncidentReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InvestigationMeeting" ADD CONSTRAINT "InvestigationMeeting_incident_report_id_fkey" FOREIGN KEY ("incident_report_id") REFERENCES "IncidentReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProblemSolution" ADD CONSTRAINT "ProblemSolution_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "InvestigationMeeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TroubleshootSolution" ADD CONSTRAINT "TroubleshootSolution_solution_id_fkey" FOREIGN KEY ("solution_id") REFERENCES "ProblemSolution"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerApprove" ADD CONSTRAINT "ManagerApprove_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "InvestigationMeeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ManagerApprove" ADD CONSTRAINT "ManagerApprove_solution_id_fkey" FOREIGN KEY ("solution_id") REFERENCES "ProblemSolution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
