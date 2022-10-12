import type { ZodError, ZodSchema } from "zod";
import * as Z from "zod";

type ActionErrors<T> = Partial<Record<keyof T, string>>;
export async function validationAction<ActionInput>({
  formData,
  schema,
}: {
  formData: FormData;
  schema: ZodSchema;
}) {
  const body = Object.fromEntries(formData);

  try {
    const formdata = schema.parse(body) as ActionInput;
    return { formdata, errors: null };
  } catch (e: any) {
    const errors = e as ZodError<ActionInput>;
    return {
      formdata: body,
      errors: errors.issues.reduce((acc: ActionErrors<ActionInput>, curr) => {
        const key = curr.path[0] as keyof ActionInput;
        acc[key] = curr.message;
        return acc;
      }, {}),
    };
  }
}

const first_name = Z.string({
  required_error: "firsName is required",
}).nonempty({ message: "First name is required" });
const last_name = Z.string({ required_error: "lastName is required" }).nonempty(
  { message: "Last name is required" }
);
const phone = Z.string().startsWith("09", {
  message: "Phone number start with 09...",
});
export const schema = Z.object({
  first_name,
  last_name,
  phone,
});

export type ActionInput = Z.TypeOf<typeof schema>;
