-- Add tutor video, structured availability, personality traits, and named portfolio items

ALTER TABLE "TutorProfile" ADD COLUMN IF NOT EXISTS "videoUrl" TEXT;
ALTER TABLE "TutorProfile" ADD COLUMN IF NOT EXISTS "availabilitySlots" TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE "TutorProfile" ADD COLUMN IF NOT EXISTS "personalityTraits" TEXT[] NOT NULL DEFAULT '{}';
ALTER TABLE "TutorProfile" ADD COLUMN IF NOT EXISTS "portfolioItems" JSONB NOT NULL DEFAULT '[]';
