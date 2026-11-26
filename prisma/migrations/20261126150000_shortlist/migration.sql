-- Shortlist (the bucket) is now separate from likes (the heart).
CREATE TABLE IF NOT EXISTS "Shortlist" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tutorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Shortlist_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Shortlist_userId_tutorId_key" ON "Shortlist"("userId", "tutorId");

DO $$ BEGIN
  ALTER TABLE "Shortlist" ADD CONSTRAINT "Shortlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- Hearts used to be the shortlist, so keep everyone's existing bucket.
INSERT INTO "Shortlist" ("id", "userId", "tutorId", "createdAt")
SELECT 'sl_' || "id", "userId", "targetId", "createdAt" FROM "Like" WHERE "targetType" = 'TUTOR'
ON CONFLICT DO NOTHING;
