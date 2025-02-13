/*
  Warnings:

  - You are about to drop the column `displayName` on the `SelectedUser` table. All the data in the column will be lost.
  - You are about to drop the column `jobTitle` on the `SelectedUser` table. All the data in the column will be lost.
  - You are about to drop the column `mail` on the `SelectedUser` table. All the data in the column will be lost.
  - Added the required column `display_name` to the `SelectedUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `SelectedUser` table without a default value. This is not possible if the table is not empty.
  - Added the required column `job_title` to the `SelectedUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SelectedUser" DROP COLUMN "displayName",
DROP COLUMN "jobTitle",
DROP COLUMN "mail",
ADD COLUMN     "display_name" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "job_title" TEXT NOT NULL;
