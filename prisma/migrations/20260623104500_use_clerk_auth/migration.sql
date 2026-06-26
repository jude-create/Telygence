-- Add Clerk's stable user id to local users.
ALTER TABLE "User" ADD COLUMN "clerkId" TEXT;

-- Remove the custom password auth field now that Clerk owns authentication.
ALTER TABLE "User" DROP COLUMN "passwordHash";

-- Optional unique values are allowed in Postgres; multiple NULL rows are valid.
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");
