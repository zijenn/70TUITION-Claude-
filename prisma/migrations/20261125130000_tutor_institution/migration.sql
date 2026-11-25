-- Where the tutor got their highest education (e.g. "National University of Singapore").
ALTER TABLE "TutorProfile" ADD COLUMN IF NOT EXISTS "institution" TEXT;
