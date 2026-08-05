-- Add admin flag on User and phone number on TutorProfile (for WhatsApp contact)

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isAdmin" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "TutorProfile" ADD COLUMN IF NOT EXISTS "phoneNumber" TEXT;
