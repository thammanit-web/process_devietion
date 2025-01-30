/*
  Warnings:

  - You are about to drop the `TroubleshootFile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TroubleshootFile" DROP CONSTRAINT "TroubleshootFile_trouibleshoot_id_fkey";

-- DropTable
DROP TABLE "TroubleshootFile";
