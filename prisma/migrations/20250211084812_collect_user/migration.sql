/*
  Warnings:

  - You are about to drop the column `display_name` on the `SelectedUser` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `SelectedUser` table. All the data in the column will be lost.
  - You are about to drop the column `job_title` on the `SelectedUser` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SelectedUser" DROP COLUMN "display_name",
DROP COLUMN "email",
DROP COLUMN "job_title";
