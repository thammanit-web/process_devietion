-- AlterTable
ALTER TABLE "ProblemSolution" ADD COLUMN     "email_assign" TEXT;

-- AlterTable
ALTER TABLE "SelectedUser" ADD COLUMN     "display_name" TEXT,
ADD COLUMN     "email" TEXT,
ALTER COLUMN "userId" DROP NOT NULL;
