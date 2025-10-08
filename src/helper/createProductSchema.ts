import { z } from "zod";

const MAX_FILE_SIZE = 1 * 1024 * 1024; // maksimal 1 mb gambar
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/jpg"];

export const productFormSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(1, "Product description is required"),
  price: z.coerce
    .number()
    .positive("Price is required and must be positive value"),
  category: z.string().min(1, "Category is required"),
  images: z
    .any()
    .refine(
      (files: FileList) => files?.length >= 1,
      "You have to upload at least 1 picture"
    )
    .refine(
      (files: FileList) =>
        Array.from(files).every((file) => file.size <= MAX_FILE_SIZE),
      `Picture size maximal 5 mb.`
    )
    .refine(
      (files: FileList) =>
        Array.from(files).every((file) =>
          ACCEPTED_IMAGE_TYPES.includes(file.type)
        ),
      "Only accepted .jpg, .jpeg, and .png"
    ),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
