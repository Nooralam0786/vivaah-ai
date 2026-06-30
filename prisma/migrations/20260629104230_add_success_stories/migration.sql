-- CreateTable
CREATE TABLE "SuccessStory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "partnerName" TEXT NOT NULL,
    "story" TEXT NOT NULL,
    "marriageDate" TEXT,
    "city" TEXT,
    "photo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "SuccessStory_status_idx" ON "SuccessStory"("status");
