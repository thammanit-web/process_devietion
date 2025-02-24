/*
  Warnings:

  - You are about to alter the column `token` on the `SessionToken` table. The data in that column could be lost. The data in that column will be cast from `NVarChar(1000)` to `Text`.

*/
BEGIN TRY

BEGIN TRAN;

-- DropIndex
ALTER TABLE [dbo].[SessionToken] DROP CONSTRAINT [SessionToken_token_key];

-- AlterTable
ALTER TABLE [dbo].[SessionToken] ALTER COLUMN [token] TEXT NOT NULL;

COMMIT TRAN;

END TRY
BEGIN CATCH

IF @@TRANCOUNT > 0
BEGIN
    ROLLBACK TRAN;
END;
THROW

END CATCH
