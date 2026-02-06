import z from "zod";

export const customerSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters long")
    .max(100, "Full name must be less than 100 characters long")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),
  email: z
    .email("Invalid email address")
    .max(255, "Email must be less than 255 characters long")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Email must be a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .max(255, "Password must be less than 255 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
    ),
  phoneNumber: z
    .string()
    .min(10, "Phone number must be at least 10 digits long")
    .max(15, "Phone number must be less than 15 digits long")
    .regex(
      /^\+?[1-9]\d{1,14}$/,
      "Phone number must be a valid international phone number",
    )
    .optional(),
  address: z
    .string()
    .max(255, "Address must be less than 255 characters long")
    .optional(),
  city: z
    .string()
    .max(100, "City must be less than 100 characters long")
    .optional(),
  state: z
    .string()
    .max(100, "State must be less than 100 characters long")
    .optional(),
  zipCode: z
    .string()
    .max(20, "Zip code must be less than 20 characters long")
    .optional(),
  profileImage: z.url("Profile picture must be a valid URL").optional(),
});

export type CustomerInput = z.infer<typeof customerSchema>;
