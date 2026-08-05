import { z } from "zod";
import { DAYS_OF_WEEK, LEVELS, PERSONALITY_TRAITS, REGIONS } from "./constants";

const slotRegex = new RegExp(`^(${DAYS_OF_WEEK.join("|")})\\|\\d{1,2}\\|\\d{1,2}$`);

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(200),
});

export const tutorProfileSchema = z.object({
  name: z.string().trim().min(1).max(100),
  edu: z.string().trim().min(1).max(150),
  levels: z.array(z.enum(LEVELS as [string, ...string[]])).min(1),
  subjects: z.array(z.string().trim().min(1)).min(1).max(10),
  region: z.enum(REGIONS as [string, ...string[]]),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter a valid 6-digit Singapore postal code")
    .nullable()
    .optional()
    .or(z.literal("")),
  line: z.string().trim().min(1).max(140),
  rate: z.number().int().min(1).max(1000),
  ft: z.boolean(),
  gender: z.enum(["Male", "Female"]),
  avail: z.string().trim().max(150).default(""),
  mode: z.enum(["Online", "Physical", "Both"]),
  bio: z.string().trim().min(1).max(3000),
  photoUrl: z.string().url().max(500).nullable().optional(),
  galleryUrls: z.array(z.string().url().max(500)).max(5).optional(),
  videoUrl: z.string().url().max(500).nullable().optional(),
  availabilitySlots: z.array(z.string().regex(slotRegex)).max(50).optional(),
  personalityTraits: z.array(z.enum(PERSONALITY_TRAITS as [string, ...string[]])).max(14).optional(),
  portfolioItems: z
    .array(
      z.object({
        url: z.string().url().max(500),
        title: z.string().trim().min(1).max(100),
      })
    )
    .max(10)
    .optional(),
});

export const studentProfileSchema = z.object({
  subject: z.string().trim().min(1).max(100),
  rate: z.number().int().min(1).max(1000),
  region: z.enum(REGIONS as [string, ...string[]]),
  timing: z.string().trim().min(1).max(150),
  freq: z.string().trim().min(1).max(50),
  duration: z.string().trim().min(1).max(50),
  genderPref: z.string().trim().min(1).max(50),
  school: z.string().trim().min(1).max(150),
  bio: z.string().trim().min(1).max(3000),
});

export const likeToggleSchema = z.object({
  targetType: z.enum(["TUTOR", "STUDENT"]),
  targetId: z.string().min(1),
});

export const sendMessageSchema = z.object({
  recipientId: z.string().min(1),
  body: z.string().trim().min(1).max(4000),
});
