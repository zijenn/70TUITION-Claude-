import { z } from "zod";
import { LEVELS, REGIONS } from "./constants";

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
  line: z.string().trim().min(1).max(140),
  rate: z.number().int().min(1).max(1000),
  ft: z.boolean(),
  gender: z.string().trim().min(1).max(30),
  avail: z.string().trim().min(1).max(150),
  mode: z.enum(["Online", "Physical", "Both"]),
  bio: z.string().trim().min(1).max(3000),
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
  targetType: z.enum(["TUTOR", "STUDENT", "CENTER"]),
  targetId: z.string().min(1),
});

export const sendMessageSchema = z.object({
  recipientId: z.string().min(1),
  body: z.string().trim().min(1).max(4000),
});
