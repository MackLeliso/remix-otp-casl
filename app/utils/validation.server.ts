import z from "zod";

const first_name = z.string().min(1, { message: "First name is required" });
const last_name = z.string().min(1, { message: "Last name is required" });
const phone = z
  .string()
  .min(1, { message: "Phone number is required" })
  .startsWith("09", {
    message: "  Phone number start with 09...",
  });

const userSchema = z.object({
  first_name,
  last_name,
  phone,
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
