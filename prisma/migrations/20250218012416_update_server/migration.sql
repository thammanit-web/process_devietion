BEGIN TRY

BEGIN TRAN;

-- CreateTable
CREATE TABLE [dbo].[IncidentReport] (
    [id] INT NOT NULL IDENTITY(1,1),
    [ref_no] NVARCHAR(1000) NOT NULL,
    [priority] NVARCHAR(1000),
    [topic] NVARCHAR(1000),
    [category_report] NVARCHAR(1000),
    [machine_code] NVARCHAR(1000),
    [machine_name] NVARCHAR(1000),
    [incident_date] DATETIME2,
    [incident_description] NVARCHAR(1000),
    [summary_incident] NVARCHAR(1000),
    [reporter_name] NVARCHAR(1000),
    [report_date] DATETIME2,
    [status_report] NVARCHAR(1000),
    [head_approve] NVARCHAR(1000),
    CONSTRAINT [IncidentReport_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ReportFile] (
    [id] INT NOT NULL IDENTITY(1,1),
    [file_url] NVARCHAR(1000),
    [incident_report_id] INT,
    CONSTRAINT [ReportFile_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[InvestigationMeeting] (
    [id] INT NOT NULL IDENTITY(1,1),
    [incident_report_id] INT,
    [topic_meeting] NVARCHAR(1000),
    [scheduled_date] DATETIME2,
    [meeting_date] DATETIME2,
    [summary_meeting] NVARCHAR(1000),
    [investigation_signature] NVARCHAR(1000),
    [manager_approve] NVARCHAR(1000),
    CONSTRAINT [InvestigationMeeting_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[SelectedUser] (
    [id] INT NOT NULL IDENTITY(1,1),
    [userId] NVARCHAR(1000),
    [display_name] NVARCHAR(1000),
    [email] NVARCHAR(1000),
    [meeting_id] INT,
    CONSTRAINT [SelectedUser_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[MeetingFile] (
    [id] INT NOT NULL IDENTITY(1,1),
    [file_url] NVARCHAR(1000),
    [meeting_id] INT,
    CONSTRAINT [MeetingFile_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ProblemSolution] (
    [id] INT NOT NULL IDENTITY(1,1),
    [meeting_id] INT,
    [topic_solution] NVARCHAR(1000) NOT NULL,
    [assign_to] NVARCHAR(1000),
    [email_assign] NVARCHAR(1000),
    [target_finish] DATETIME2,
    [status_solution] NVARCHAR(1000),
    [manager_approve] NVARCHAR(1000),
    CONSTRAINT [ProblemSolution_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[TroubleshootSolution] (
    [id] INT NOT NULL IDENTITY(1,1),
    [solution_id] INT NOT NULL,
    [result_troubleshoot] NVARCHAR(1000),
    [file_summary] NVARCHAR(1000),
    [finish_date] DATETIME2,
    CONSTRAINT [TroubleshootSolution_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- CreateTable
CREATE TABLE [dbo].[ManagerApprove] (
    [id] INT NOT NULL IDENTITY(1,1),
    [meeting_id] INT,
    [solution_id] INT,
    [comment_solution] NVARCHAR(1000),
    [comment_troubleshoot] NVARCHAR(1000),
    CONSTRAINT [ManagerApprove_pkey] PRIMARY KEY CLUSTERED ([id])
);

-- AddForeignKey
ALTER TABLE [dbo].[ReportFile] ADD CONSTRAINT [ReportFile_incident_report_id_fkey] FOREIGN KEY ([incident_report_id]) REFERENCES [dbo].[IncidentReport]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[InvestigationMeeting] ADD CONSTRAINT [InvestigationMeeting_incident_report_id_fkey] FOREIGN KEY ([incident_report_id]) REFERENCES [dbo].[IncidentReport]([id]) ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[SelectedUser] ADD CONSTRAINT [SelectedUser_meeting_id_fkey] FOREIGN KEY ([meeting_id]) REFERENCES [dbo].[InvestigationMeeting]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[MeetingFile] ADD CONSTRAINT [MeetingFile_meeting_id_fkey] FOREIGN KEY ([meeting_id]) REFERENCES [dbo].[InvestigationMeeting]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ProblemSolution] ADD CONSTRAINT [ProblemSolution_meeting_id_fkey] FOREIGN KEY ([meeting_id]) REFERENCES [dbo].[InvestigationMeeting]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[TroubleshootSolution] ADD CONSTRAINT [TroubleshootSolution_solution_id_fkey] FOREIGN KEY ([solution_id]) REFERENCES [dbo].[ProblemSolution]([id]) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE [dbo].[ManagerApprove] ADD CONSTRAINT [ManagerApprove_meeting_id_fkey] FOREIGN KEY ([meeting_id]) REFERENCES [dbo].[InvestigationMeeting]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE [dbo].[ManagerApprove] ADD CONSTRAINT [ManagerApprove_solution_id_fkey] FOREIGN KEY ([solution_id]) REFERENCES [dbo].[ProblemSolution]([id]) ON DELETE NO ACTION ON UPDATE NO ACTION;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
