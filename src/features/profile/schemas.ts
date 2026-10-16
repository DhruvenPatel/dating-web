import { z } from "zod";
import { isAdult } from "@/features/auth/schemas";

const tags = z
  .array(z.string().trim().min(1).max(30))
  .max(15, "You can add up to 15 items");

const short = z.string().trim().max(100, "Must be 100 characters or less");

export const profileSchema = z.object({
  display_name: z
    .string()
    .trim()
    .max(100, "Must be 100 characters or less")
    .refine((v) => v === "" || v.length >= 2, "At least 2 characters"),
  bio: z.string().max(500, "Bio must be 500 characters or less"),
  gender: z.string(),
  date_of_birth: z.string().refine((v) => !v || isAdult(v), "You must be at least 18 years old"),
  occupation: short,
  country: short,
  state: short,
  city: short,
  languages: tags,
  interests: tags,
  hobbies: tags,
});

export type ProfileFormValues = z.infer<typeof profileSchema>;