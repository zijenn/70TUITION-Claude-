-- Remove tuition centers feature and add tutor postal code

DROP TABLE IF EXISTS "Center";

BEGIN;
CREATE TYPE "TargetType_new" AS ENUM ('TUTOR', 'STUDENT');
ALTER TABLE "Like" ALTER COLUMN "targetType" TYPE "TargetType_new" USING ("targetType"::text::"TargetType_new");
ALTER TYPE "TargetType" RENAME TO "TargetType_old";
ALTER TYPE "TargetType_new" RENAME TO "TargetType";
DROP TYPE "TargetType_old";
COMMIT;

ALTER TABLE "TutorProfile" ADD COLUMN IF NOT EXISTS "postalCode" TEXT;
