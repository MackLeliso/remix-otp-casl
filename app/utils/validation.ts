import type { ZodError, ZodSchema } from "zod";
import * as Z from "zod";

type ActionErrors<T> = Partial<Record<keyof T, string>>;
export async function validationAction<ActionInput>({
  request,
  schema,
}: {
  request: Request;
  schema: ZodSchema;
}) {
  const body = Object.fromEntries(await request.formData());

  try {
    const formData = schema.parse(body) as ActionInput;
    return { formData, errors: null };
  } catch (e) {
    const errors = e as ZodError<ActionInput>;
    return {
      formData: body,
      errors: errors.issues.reduce((acc: ActionErrors<ActionInput>, curr) => {
        const key = curr.path[0] as keyof ActionInput;
        acc[key] = curr.message;
        return acc;
      }, {}),
    };
  }
}

const first_name = Z.string({ required_error: "firsName is required" }).min(3, {
  message: "Must be 5 or more characters long",
});
const last_name = Z.string({ required_error: "lastName is required" }).min(3, {
  message: "Must be 5 or more characters long",
});
const phone = Z.string({ required_error: "phone is required" }).min(9);

export const schema = Z.object({
  first_name,
  last_name,
  phone,
});

export type ActionInput = Z.TypeOf<typeof schema>;
