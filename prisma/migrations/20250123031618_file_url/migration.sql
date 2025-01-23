/*
  Warnings:

  - You are about to drop the column `image_url` on the `ReferenceImage` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ReferenceImage" DROP COLUMN "image_url",
ADD COLUMN     "file_url" TEXT;
