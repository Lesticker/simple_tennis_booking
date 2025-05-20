-- AlterTable
ALTER TABLE "TennisCourt" ADD COLUMN     "submittedById" TEXT;

-- CreateTable
CREATE TABLE "SubmissionLimit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubmissionLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SubmissionLimit_userId_date_idx" ON "SubmissionLimit"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "SubmissionLimit_userId_date_key" ON "SubmissionLimit"("userId", "date");

-- AddForeignKey
ALTER TABLE "SubmissionLimit" ADD CONSTRAINT "SubmissionLimit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
