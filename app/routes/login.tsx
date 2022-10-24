import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useTransition, useActionData } from "@remix-run/react";
import { z } from "zod";
import { verifyOtp, loginOtp } from "~/utils/otp.server";
import { createUserSession } from "~/utils/session.server";
import { validLogin } from "~/utils/validation.server";

type ActonData = {
  phone: string;
};
type LoginData = {
  message: string;
  status: number;
};

export const action: ActionFunction = async ({ context, request }) => {
  const fields = (await Object.fromEntries(
    await request.formData()
  )) as ActonData;

  // schema validation
  const { success, data, field, fieldErrors } = await validLogin(fields);
  if (!success) return { field, fieldErrors };
  const { message } = (await loginOtp(data.phone)) as LoginData;
  if (message === "otp-sent")
    return await createUserSession({ phone: data.phone }, `/verify`);
  return { message };
};

export default function signIn() {
  const actionData = useActionData();
  const { state } = useTransition();
  const busy = state === "submitting";

  return (
    <Box display="flex" justifyContent="center" p={5}>
      <Box minWidth={500} bgcolor="darkcyan" borderRadius={2}>
        <Form method="post">
          <Stack spacing={{ xs: 2, sm: 2, md: 3 }} p={5} gap={2}>
            <Typography
              padding={2}
              fontWeight="bold"
              color="white"
              textAlign="center"
            >
              Login Now
            </Typography>
            <Typography mb={2} variant="subtitle1" color="error">
              {actionData?.message}
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

            <Button disabled={busy} type="submit" variant="contained">
              {busy ? "Submittting..." : "Login"}
            </Button>
          </Stack>
        </Form>
        <Stack
          color="white"
          direction="row"
          p={2}
          justifyContent="space-evenly"
        >
          <Link href="signup" color="white" underline="none">
            Don't have an account ?
          </Link>
          <Link href="/login" color="white" underline="none">
            Forgot Password?
          </Link>
        </Stack>
      </Box>
    </Box>
  );
}
