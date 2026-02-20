/*
  Warnings:

  - Made the column `defaultBillingAddressID` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `defaultShippingAddressID` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "users" ALTER COLUMN "defaultBillingAddressID" SET NOT NULL,
ALTER COLUMN "defaultShippingAddressID" SET NOT NULL;
