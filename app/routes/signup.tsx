import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { ActionFunction, LoaderFunction } from "@remix-run/node";
import { Form, useTransition, useActionData, Outlet } from "@remix-run/react";
import { User } from "@prisma/client";

import { RegistrationOtp } from "~/utils/otp.server";
import { createUserSession } from "~/utils/session.server";
import { validRegistration } from "~/utils/validation.server";
import { db } from "~/utils/db.server";

type RegistrationData = {
  message: string;
  status: number;
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const fields = Object.fromEntries(formData) as Pick<
    User,
    "first_name" | "last_name" | "phone"
  >;
  // schema validation
  const { success, data, field, fieldErrors } = await validRegistration(fields);
  if (!success) return { field, fieldErrors };
  const { message } = (await RegistrationOtp(data.phone)) as RegistrationData;
  if (message === "otp-sent") return await createUserSession(data, `/verify`);
  return { message };
};

export default function signup() {
  const actionData = useActionData();
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
              defaultValue={actionData?.field?.first_name}
            />
            <Typography variant="subtitle2" color="error">
              {actionData?.fieldErrors?.first_name}
            </Typography>
            <TextField
              id="filled-hidden-label-small"
              placeholder="Last Name"
              name="last_name"
              variant="filled"
              size="small"
              defaultValue={actionData?.field?.last_name}
            />
            <Typography variant="subtitle2" color="error">
              {actionData?.fieldErrors?.last_name}
            </Typography>
            <TextField
              id="filled-hidden-label-small"
              placeholder="Phone"
              name="phone"
              variant="filled"
              size="small"
              defaultValue={actionData?.field?.phone}
            />
            <Typography variant="subtitle2" color="error">
              {actionData?.fieldErrors?.phone}
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
