/*
  Warnings:

  - Added the required column `status` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "FileStatus" AS ENUM ('UPLOADED', 'PROCESSING', 'COMPLETED', 'FAILED');

-- AlterTable
ALTER TABLE "file" ADD COLUMN     "message" TEXT,
ADD COLUMN     "status" "FileStatus" NOT NULL;
