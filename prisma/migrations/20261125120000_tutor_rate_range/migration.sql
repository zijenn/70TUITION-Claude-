-- Rate as a range: "rate" is the lower end, "rateMax" the upper end (null = single price).
ALTER TABLE "TutorProfile" ADD COLUMN IF NOT EXISTS "rateMax" INTEGER;
