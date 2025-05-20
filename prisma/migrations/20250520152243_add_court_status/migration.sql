-- CreateEnum
CREATE TYPE "CourtStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "TennisCourt" ADD COLUMN     "status" "CourtStatus" NOT NULL DEFAULT 'PENDING',
ALTER COLUMN "latitude" DROP NOT NULL,
ALTER COLUMN "longitude" DROP NOT NULL;
