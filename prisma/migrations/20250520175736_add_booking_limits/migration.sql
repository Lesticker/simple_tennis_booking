-- CreateTable
CREATE TABLE "BookingLimit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date" DATE NOT NULL,
    "count" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookingLimit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookingLimit_userId_date_idx" ON "BookingLimit"("userId", "date");

-- CreateIndex
CREATE UNIQUE INDEX "BookingLimit_userId_date_key" ON "BookingLimit"("userId", "date");

-- AddForeignKey
ALTER TABLE "BookingLimit" ADD CONSTRAINT "BookingLimit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
