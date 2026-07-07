/*
  Warnings:

  - Added the required column `fileName` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mimeType` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "file" ADD COLUMN     "fileName" TEXT NOT NULL,
ADD COLUMN     "mimeType" TEXT NOT NULL;
