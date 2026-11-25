-- Tutor credentials: own exam results, experience, track record.
-- (portfolioItems stays and is shown as "Certificates and awards".)

ALTER TABLE "TutorProfile" ADD COLUMN IF NOT EXISTS "results" JSONB NOT NULL DEFAULT '[]';
ALTER TABLE "TutorProfile" ADD COLUMN IF NOT EXISTS "yearsExperience" INTEGER;
ALTER TABLE "TutorProfile" ADD COLUMN IF NOT EXISTS "studentsTaught" INTEGER;
ALTER TABLE "TutorProfile" ADD COLUMN IF NOT EXISTS "trackRecord" TEXT[] NOT NULL DEFAULT '{}';
