/*
  Warnings:

  - The values [KAT] on the enum `User` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "User_new" AS ENUM ('CAT', 'SHANNON');
ALTER TABLE "Message" ALTER COLUMN "user" TYPE "User_new" USING ("user"::text::"User_new");
ALTER TYPE "User" RENAME TO "User_old";
ALTER TYPE "User_new" RENAME TO "User";
DROP TYPE "User_old";
COMMIT;
