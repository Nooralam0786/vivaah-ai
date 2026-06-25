-- AlterTable
ALTER TABLE "Preference" ADD COLUMN "castePreference" TEXT;
ALTER TABLE "Preference" ADD COLUMN "drinkingPref" TEXT;
ALTER TABLE "Preference" ADD COLUMN "maritalStatusPref" TEXT;
ALTER TABLE "Preference" ADD COLUMN "smokingPref" TEXT;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN "dietPreference" TEXT;
ALTER TABLE "Profile" ADD COLUMN "drinkingHabit" TEXT;
ALTER TABLE "Profile" ADD COLUMN "lastActiveAt" DATETIME;
ALTER TABLE "Profile" ADD COLUMN "smokingHabit" TEXT;

-- CreateTable
CREATE TABLE "Pass" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fromUserId" TEXT NOT NULL,
    "toUserId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pass_fromUserId_fkey" FOREIGN KEY ("fromUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Pass_toUserId_fkey" FOREIGN KEY ("toUserId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ProfileView" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "viewerId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ProfileView_viewerId_fkey" FOREIGN KEY ("viewerId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ProfileView_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "onboardingStep" TEXT NOT NULL DEFAULT 'complete',
    "gender" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_User" ("createdAt", "email", "fullName", "id", "passwordHash", "phone", "phoneVerified", "updatedAt") SELECT "createdAt", "email", "fullName", "id", "passwordHash", "phone", "phoneVerified", "updatedAt" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Pass_fromUserId_toUserId_key" ON "Pass"("fromUserId", "toUserId");

-- CreateIndex
CREATE INDEX "ProfileView_profileId_idx" ON "ProfileView"("profileId");

-- CreateIndex
CREATE INDEX "ProfileView_viewerId_idx" ON "ProfileView"("viewerId");
