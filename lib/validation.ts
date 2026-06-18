/**
 * Validation Utilities for VivaahAI
 */

import { z } from 'zod';

// ============================================
// Authentication Schemas
// ============================================

export const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number')
  .describe('Indian phone number');

export const emailSchema = z
  .string()
  .email('Invalid email address')
  .max(255, 'Email too long');

export const otpSchema = z
  .string()
  .length(6, 'OTP must be 6 digits')
  .regex(/^\d{6}$/, 'OTP must contain only digits');

export const loginSchema = z.object({
  phone: phoneSchema,
});

export const verifyOTPSchema = z.object({
  phone: phoneSchema,
  otp: otpSchema,
});

// ============================================
// Profile Schemas
// ============================================

export const genderEnum = z.enum(['male', 'female', 'other']);

export const profileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  age: z
    .number()
    .min(18, 'Must be at least 18 years old')
    .max(80, 'Age must be less than 80'),
  gender: genderEnum,
  religion: z.string().min(1, 'Religion is required'),
  caste: z.string().optional(),
  education: z.string().min(1, 'Education is required'),
  profession: z.string().min(1, 'Profession is required'),
  incomeRange: z.string().min(1, 'Income range is required'),
  locationCity: z.string().min(1, 'Location is required'),
  bio: z
    .string()
    .max(500, 'Bio must be less than 500 characters')
    .optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const preferencesSchema = z.object({
  ageMin: z.number().min(18, 'Minimum age must be at least 18'),
  ageMax: z.number().max(80, 'Maximum age must be less than 80'),
  religions: z.array(z.string()).min(1, 'Select at least one religion'),
  castes: z.array(z.string()).optional(),
  educationMin: z.string().optional(),
  distanceKm: z.number().min(1, 'Distance must be at least 1 km').max(500, 'Distance must be less than 500 km'),
});

export type PreferencesFormData = z.infer<typeof preferencesSchema>;

// ============================================
// Verification Schemas
// ============================================

export const idTypeEnum = z.enum(['aadhaar', 'pan', 'passport', 'driving_license']);

export const idUploadSchema = z.object({
  idType: idTypeEnum,
  idNumber: z
    .string()
    .min(6, 'Invalid ID number')
    .max(20, 'Invalid ID number'),
  photo: z.instanceof(File).refine((file) => file.size <= 5 * 1024 * 1024, 'File must be less than 5MB'),
});

export type IDUploadFormData = z.infer<typeof idUploadSchema>;

// ============================================
// Payment Schemas
// ============================================

export const tierEnum = z.enum(['free', 'gold', 'platinum', 'diamond']);

export const subscriptionSchema = z.object({
  tier: tierEnum,
  autoRenewal: z.boolean().default(true),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

// ============================================
// Chat Schemas
// ============================================

export const messageSchema = z.object({
  content: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(5000, 'Message is too long'),
  toUserId: z.string().uuid('Invalid user ID'),
});

export type MessageFormData = z.infer<typeof messageSchema>;

// ============================================
// Utility Functions
// ============================================

export function validatePhone(phone: string): boolean {
  try {
    phoneSchema.parse(phone);
    return true;
  } catch {
    return false;
  }
}

export function validateEmail(email: string): boolean {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
}

export function validateOTP(otp: string): boolean {
  try {
    otpSchema.parse(otp);
    return true;
  } catch {
    return false;
  }
}

export function getValidationError(schema: z.ZodSchema, data: unknown): string | null {
  try {
    schema.parse(data);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      return error.errors[0]?.message || 'Validation failed';
    }
    return 'Validation failed';
  }
}
