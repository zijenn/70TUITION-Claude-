import { z } from "zod";
import { DAYS_OF_WEEK, LEVELS, PERSONALITY_TRAITS, REGIONS, canonicalSubjects } from "./constants";
import { formatName, sentenceCase } from "./format";
import { regionForPostal } from "./singapore-postal";

const slotRegex = new RegExp(`^(${DAYS_OF_WEEK.join("|")})\\|\\d{1,2}\\|\\d{1,2}$`);

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(200),
});

export const tutorProfileSchema = z.object({
  name: z.string().trim().min(1).max(100).transform(formatName),
  edu: z.string().trim().min(1).max(150),
  levels: z.array(z.enum(LEVELS as [string, ...string[]])).min(1),
  subjects: z
    .array(z.string().trim().min(1).max(120))
    .min(1)
    .max(40)
    .transform(canonicalSubjects),
  region: z.enum(REGIONS as [string, ...string[]]),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter a valid 6-digit Singapore postal code")
    .nullable()
    .optional()
    .or(z.literal("")),
  line: z.string().trim().min(1).max(140).transform(sentenceCase),
  rate: z.number().int().min(1).max(1000),
  ft: z.boolean(),
  gender: z.enum(["Male", "Female"]),
  avail: z.string().trim().max(150).default(""),
  mode: z.enum(["Online", "Physical", "Both"]),
  bio: z.string().trim().min(1).max(3000).transform(sentenceCase),
  photoUrl: z.string().url().max(500).nullable().optional(),
  galleryUrls: z.array(z.string().url().max(500)).max(5).optional(),
  videoUrl: z.string().url().max(500).nullable().optional(),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^\d{8}$/, "Enter a valid 8-digit Singapore phone number")
    .nullable()
    .optional()
    .or(z.literal("")),
  availabilitySlots: z.array(z.string().regex(slotRegex)).max(50).optional(),
  personalityTraits: z.array(z.enum(PERSONALITY_TRAITS as [string, ...string[]])).max(14).optional(),
  results: z
    .array(
      z.object({
        exam: z.string().trim().min(1).max(40),
        subject: z.string().trim().min(1).max(80),
        grade: z.string().trim().min(1).max(20),
      })
    )
    .max(8)
    .optional(),
  yearsExperience: z.number().int().min(0).max(60).nullable().optional(),
  studentsTaught: z.number().int().min(0).max(10000).nullable().optional(),
  trackRecord: z.array(z.string().trim().min(1).max(140).transform(sentenceCase)).max(5).optional(),
  portfolioItems: z
    .array(
      z.object({
        url: z.string().url().max(500),
        title: z.string().trim().min(1).max(100),
      })
    )
    .max(10)
    .optional(),
}).refine((d) => d.mode === "Online" || d.region !== "Online" || !!regionForPostal(d.postalCode), {
  message: "Choose the region where you teach in person.",
  path: ["region"],

});

export const likeToggleSchema = z.object({
  targetType: z.literal("TUTOR"),
  targetId: z.string().min(1),
});

export const sendMessageSchema = z.object({
  recipientId: z.string().min(1),
  body: z.string().trim().min(1).max(4000),
});
