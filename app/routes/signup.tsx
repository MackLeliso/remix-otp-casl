import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { ActionFunction, json } from "@remix-run/node";
import { Form, useTransition, useActionData, Outlet } from "@remix-run/react";
import { User } from "@prisma/client";

import { RegistrationOtp } from "~/utils/otp.server";
import { createUserSession } from "~/utils/session.server";

type RegistrationData = {
  message: string;
  status: number;
};
export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const { first_name, last_name, phone } = Object.fromEntries(formData) as Pick<
    User,
    "first_name" | "last_name" | "phone"
  >;
  const { message } = (await RegistrationOtp(phone)) as RegistrationData;
  if (message === "otp-sent") {
    return await createUserSession({ first_name, last_name, phone }, `/verify`);
  }
  return { message, first_name, last_name, phone };
};

export default function signup() {
  const actionData = useActionData();
  console.log("actionData", actionData);
  const { state } = useTransition();
  const busy = state === "submitting";

  return (
    <Box display="flex" justifyContent="center" p={5}>
      <Box minWidth={500} bgcolor="darkcyan" borderRadius={2}>
        <Form method="post">
          <Stack spacing={{ xs: 1, sm: 2, md: 3 }} p={3}>
            <Typography
              padding={2}
              fontWeight="bold"
              color="white"
              textAlign="center"
            >
              Sign Up
            </Typography>
            <Typography variant="subtitle2" color="error">
              {actionData?.message}
            </Typography>
            <TextField
              id="filled-hidden-label-small"
              placeholder="First Name"
              name="first_name"
              variant="filled"
              size="small"
              defaultValue={actionData?.first_name}
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
              defaultValue={actionData?.last_name}
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
              defaultValue={actionData?.phone}
            />
            <Typography variant="subtitle2" color="error">
              {actionData?.errors?.phone}
            </Typography>

            <Button
              disabled={busy}
              type="submit"
              variant="contained"
              color="info"
            >
              {busy ? "Submittting..." : "Submit"}
            </Button>
          </Stack>
        </Form>
        <Stack
          color="white"
          direction="row"
          p={2}
          justifyContent="space-evenly"
        >
          <Link href="/login" color="white" underline="none">
            Login Here
          </Link>
        </Stack>
      </Box>
      <Outlet />
    </Box>
  );
}
