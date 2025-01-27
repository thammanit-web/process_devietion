/*
  Warnings:

  - You are about to drop the column `file_meeting` on the `InvestigationMeeting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "InvestigationMeeting" DROP COLUMN "file_meeting";

-- CreateTable
CREATE TABLE "MeetingFile" (
    "id" SERIAL NOT NULL,
    "file_url" TEXT,
    "meeting_id" INTEGER,

    CONSTRAINT "MeetingFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MeetingFile" ADD CONSTRAINT "MeetingFile_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "InvestigationMeeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
