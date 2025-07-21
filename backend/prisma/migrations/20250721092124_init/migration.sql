-- CreateEnum
CREATE TYPE "User" AS ENUM ('KAT', 'SHANNON');

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "user" "User" NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);
