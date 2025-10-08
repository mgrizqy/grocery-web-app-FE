import { z } from "zod";
// max file size :
const MAX_FILE_SIZE = 1 * 1024 * 1024; //2 mb file size
const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
];

export const updateUserSchema = z.object({
  first_name: z.string().min(1, "Must be at least 1 character"),
  last_name: z.string().min(1, "Must be at least 1 character").optional(),
  password: z
    .string()
    .min(6, "Must be at least 6 characters")
    .regex(/[A-Z]/, "Password at least 1 uppercase character ")
    .regex(/[a-z]/, "Password at least 1 lowercase characters")
    .regex(/[0-9]/, "Password containt at least 1 number")
    .regex(/[^A-Za-z0-9]/, "Password containt at least 1 special character")
    .optional(),
  email: z.string().email("Must be a valid email"),
  phone: z.string(),
  city: z.string().min(1, "Must be at least 1 character"),
  province: z.string().min(1, "Must be at least 1 character"),
  role: z.enum(["CUSTOMER", "STORE_ADMIN", "SUPER_ADMIN"]).optional(),
  postalCode: z.string(),
  // addresses: z.string().min(1, "Must be at least 1 character"),
  main_address: z.string().min(1, "Must be at least 1 character"),
  storeName: z.string(),
  profilePic: z
    .union([z.string(), z.instanceof(File), z.null()])
    .optional()
    .refine(
      (file) =>
        !file ||
        (file instanceof File && ACCEPTED_IMAGE_TYPES.includes(file.type)) ||
        typeof file === "string",
      "Only .jpg, .jpeg, .png, and .gif files are allowed"
    )
    .refine(
      (file) =>
        !file ||
        (file instanceof File && file.size <= MAX_FILE_SIZE) ||
        typeof file === "string",
      "Profile picture must be under 1MB"
    ),
});

export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
