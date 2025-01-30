-- CreateTable
CREATE TABLE "TroubleshootFile" (
    "id" SERIAL NOT NULL,
    "file_url" TEXT,
    "trouibleshoot_id" INTEGER,

    CONSTRAINT "TroubleshootFile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TroubleshootFile" ADD CONSTRAINT "TroubleshootFile_trouibleshoot_id_fkey" FOREIGN KEY ("trouibleshoot_id") REFERENCES "TroubleshootSolution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
