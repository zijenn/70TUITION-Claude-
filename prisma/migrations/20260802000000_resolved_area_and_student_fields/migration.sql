-- Real postal code resolution (OneMap) storage, plus mirroring tutor-side
-- location/contact/availability fields onto students.

ALTER TABLE "TutorProfile" ADD COLUMN IF NOT EXISTS "resolvedArea" TEXT;

ALTER TABLE "StudentProfile" ADD COLUMN IF NOT EXISTS "postalCode" TEXT;
ALTER TABLE "StudentProfile" ADD COLUMN IF NOT EXISTS "resolvedArea" TEXT;
ALTER TABLE "StudentProfile" ADD COLUMN IF NOT EXISTS "phoneNumber" TEXT;
ALTER TABLE "StudentProfile" ADD COLUMN IF NOT EXISTS "availabilitySlots" TEXT[] NOT NULL DEFAULT '{}';
