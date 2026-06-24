-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "gender" TEXT,
    "dob" TEXT,
    "height" TEXT,
    "religion" TEXT,
    "caste" TEXT,
    "motherTongue" TEXT,
    "maritalStatus" TEXT,
    "qualification" TEXT,
    "occupation" TEXT,
    "company" TEXT,
    "annualIncome" TEXT,
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "aboutMe" TEXT,
    "interests" TEXT NOT NULL DEFAULT '[]',
    "photo" TEXT,
    "coverPhoto" TEXT,
    "photos" TEXT NOT NULL DEFAULT '[]',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isOnline" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Profile" ("aboutMe", "annualIncome", "caste", "city", "company", "country", "createdAt", "dob", "gender", "height", "id", "interests", "isOnline", "isVerified", "maritalStatus", "motherTongue", "occupation", "photo", "qualification", "religion", "state", "updatedAt", "userId") SELECT "aboutMe", "annualIncome", "caste", "city", "company", "country", "createdAt", "dob", "gender", "height", "id", "interests", "isOnline", "isVerified", "maritalStatus", "motherTongue", "occupation", "photo", "qualification", "religion", "state", "updatedAt", "userId" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
