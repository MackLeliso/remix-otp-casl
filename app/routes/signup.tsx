import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { ActionFunction, redirect, json } from "@remix-run/node";
import { Form, useTransition, useActionData } from "@remix-run/react";
import { User } from "@prisma/client";
import { ActionInput, schema, validationAction } from "~/utils/validation";
import {
  phoneVerification,
  checkPhoneVerification,
} from "~/utils/verification";
import { number } from "zod";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const submitType = form.get("_method");
  console.log(submitType);

  if (submitType === "register") {
    const { formData, errors } = await validationAction<ActionInput>({
      form,
      schema,
    });

    if (errors) {
      return json({ errors }, { status: 400 });
    }
    const { first_name, last_name, phone } = formData;
    const field: Pick<User, "first_name" | "last_name" | "phone"> = {
      first_name,
      last_name,
      phone,
    };
    const res = await phoneVerification(phone);
    console.log(res);
    console.log("register", field);
    return json({ data: field });
  }
  if (submitType === "verifiy") {
    const body: any = form.get("user");
    const code: any = form.get("code");
    const user = JSON.parse(body);
    console.log("user", user);
    const check = await checkPhoneVerification(user.phone, code);
    console.log("check", check);
    return json({ data: user });
  }
};

export default function signup() {
  const actionData = useActionData();
  const { state } = useTransition();
  const busy = state === "submitting";
  return (
    <Box display="flex" justifyContent="center" p={5}>
      <Box minWidth={500} bgcolor="skyblue" borderRadius={2}>
        <Form method="post">
          <Stack spacing={{ xs: 1, sm: 2, md: 4 }} p={3}>
            {actionData?.data === undefined ? (
              <>
                <input type="hidden" name="_method" value="register" />
                <Typography fontWeight="bold" color="dark" textAlign="center">
                  Sign In
                </Typography>
                <TextField
                  id="filled-hidden-label-small"
                  placeholder="First Name"
                  name="first_name"
                  variant="filled"
                  size="small"
                />
                <Typography variant="subtitle2" color="error">
                  {actionData?.errors?.first_name}
                </Typography>
                <TextField
                  id="filled-hidden-label-small"
                  placeholder="Last Name"
                  name="last_name"
                  variant="filled"
                  size="small"
                />
                <Typography variant="subtitle2" color="error">
                  {actionData?.errors?.last_name}
                </Typography>
                <TextField
                  id="filled-hidden-label-small"
                  placeholder="Phone"
                  name="phone"
                  variant="filled"
                  size="small"
                />
                <Typography variant="subtitle2" color="error">
                  {actionData?.errors?.phone}
                </Typography>
              </>
            ) : (
              <>
                <input
                  type="hidden"
                  name="user"
                  value={JSON.stringify(actionData?.data)}
                />
                <TextField
                  id="filled-hidden-label-small"
                  placeholder="Code"
                  name="code"
                  variant="filled"
                  size="small"
                />
                <input type="hidden" name="_method" value="verifiy" />
              </>
            )}
            <Button disabled={busy} type="submit" variant="contained">
              {busy ? "Submittting..." : "Submit"}
            </Button>
          </Stack>
        </Form>
      </Box>
    </Box>
  );
}
