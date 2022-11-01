import z, { record } from "zod";

const id = z.string().uuid().optional();
const first_name = z.string().min(1, { message: "First name is required" });
const last_name = z.string().min(1, { message: "Last name is required" });
const phone = z
  .string()
  .min(1, { message: "Phone number is required" })
  .startsWith("09", {
    message: "  Phone number start with 09...",
  });
const name = z.string().min(1, { message: "Name is required" });
const description = z.string().optional();
const price = z.string().min(1, { message: "Price is required" }).optional();

const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const picture = z
  .any()
  .refine(
    (files) => ACCEPTED_IMAGE_TYPES.includes(files?.type),
    ".jpg, .jpeg, .png and .webp files are accepted."
  );

const userSchema = z.object({
  first_name,
  last_name,
  phone,
});

const productShema = z.object({
  name,
  description,
  price,
  picture,
  categoryId: id,
  id,
});

export const validRegistration = async (field: any) => {
  const { success, data, error } = userSchema.safeParse(field) as any;
  const fieldErrors = error?.flatten().fieldErrors;
  return { success, data, field, fieldErrors };
};

export const validLogin = async (field: any) => {
  const { success, data, error } = userSchema
    .pick({ phone: true })
    .safeParse(field) as any;
  const fieldErrors = error?.flatten().fieldErrors;
  return { success, data, field, fieldErrors };
};

export const validProduct = async (field: any) => {
  const { success, data, error } = productShema.safeParse(field) as any;
  const fieldErrors = error?.flatten().fieldErrors;
  return { success, data, field, fieldErrors };
};
