/*
  Warnings:

  - You are about to drop the column `createdAt` on the `SelectedUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SelectedUser" DROP COLUMN "createdAt",
ADD COLUMN     "meeting_id" INTEGER;

-- AddForeignKey
ALTER TABLE "SelectedUser" ADD CONSTRAINT "SelectedUser_meeting_id_fkey" FOREIGN KEY ("meeting_id") REFERENCES "InvestigationMeeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;
