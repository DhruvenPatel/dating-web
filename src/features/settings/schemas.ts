import { z } from "zod";

export const changePasswordSchema = z
  .object({
    current_password: z.string().min(1, "Enter your current password"),
    new_password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(128, "Password is too long"),
    confirm_password: z.string().min(1, "Please confirm your new password"),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })
  .refine((d) => d.new_password !== d.current_password, {
    message: "New password must be different from the current one",
    path: ["new_password"],
  });

export type ChangePasswordValues = z.infer<typeof changePasswordSchema>;