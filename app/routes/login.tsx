import { Box, Button, Link, Stack, TextField, Typography } from "@mui/material";
import { ActionFunction, json, redirect } from "@remix-run/node";
import { Form, useTransition, useActionData } from "@remix-run/react";
import { verifyOtp, loginOtp } from "~/utils/otp.server";
import { createUserSession } from "~/utils/session.server";

type ActonData = {
  phone: string;
};
type LoginData = {
  message: string;
  status: number;
};
export const action: ActionFunction = async ({ context, request }) => {
  const { phone } = (await Object.fromEntries(
    await request.formData()
  )) as ActonData;
  const { message, status } = (await loginOtp(phone)) as LoginData;
  if (message === "otp-sent") {
    return await createUserSession({ phone }, `/verify`);
  }
  return { message, phone };
};

export default function signIn() {
  const actionData = useActionData();
  console.log(actionData);
  const { state } = useTransition();
  const busy = state === "submitting";
  let m = 1;

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
              defaultValue={actionData?.phone}
            />
            <Typography variant="subtitle2" color="error">
              {actionData?.errors?.phone}
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
