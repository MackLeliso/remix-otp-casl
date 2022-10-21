import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { ActionFunction, json } from "@remix-run/node";
import { Form, useTransition, useActionData } from "@remix-run/react";
import authenticator from "~/utils/auth.server";
import { verifyOtp, loginOtp } from "~/utils/otp.server";
import { createUserSession, User } from "~/utils/session.server";
import { checkPhoneNumberExist } from "~/utils/user.server";
import {
  checkPhoneVerification,
  phoneVerification,
} from "~/utils/verification.server";

export const action: ActionFunction = async ({ context, request }) => {
  const formData = await request.formData();
  const submitType = formData.get("_method");
  if (submitType === "login") {
    const phone = formData.get("phone") as string;
    const phoneResponse = await loginOtp(phone);
    console.log(phoneResponse);
    return phoneResponse;
  }

  if (submitType === "verify") {
    const code = formData.get("code") as string;

    const otp: any = await verifyOtp(code);
    const { id, first_name, last_name, ...field } = otp.data;
    const user: { id: string; first_name: string; last_name: string } = {
      id,
      first_name,
      last_name,
    };
    console.log(user);
    return createUserSession(user, "/");

    // const checkStatus: any = await checkPhoneVerification(_phone, code);
    // if (checkStatus.status === "approved") {
    //   return await authenticator.authenticate("form", request, {
    //     successRedirect: "/",
    //     failureRedirect: "/login",
    //     throwOnError: true,
    //     context: { formData },
    //   });
    // } else if (checkStatus.status === "rejected") {
    //   return json({ rejected: "please try again" });
    // } else {
    //   return json({ rejected: "Something went wrong, Please try again" });
    // }

    return null;
  }
};

export default function signIn() {
  const actionData = useActionData();
  const { state } = useTransition();
  const busy = state === "submitting";
  console.log("typdddr", actionData?.status === 500);
  console.log("und", actionData);
  console.log("typr", actionData?.status === 400);

  return (
    <Box display="flex" justifyContent="center" p={5}>
      <Box minWidth={500} bgcolor="skyblue" borderRadius={2}>
        <Form method="post">
          <Stack spacing={{ xs: 1, sm: 2, md: 3 }} p={3}>
            {actionData === undefined ||
            actionData?.status === 404 ||
            actionData?.status === 500 ? (
              <>
                <Typography fontWeight="bold" color="dark" textAlign="center">
                  Sign In
                </Typography>
                <Typography variant="subtitle2" color="error">
                  {actionData?.rejected}
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
                <input type="hidden" name="_method" value="login" />
              </>
            ) : (
              <>
                <TextField
                  id="filled-hidden-label-small"
                  placeholder="OTP Code"
                  name="code"
                  variant="filled"
                  size="small"
                />
                <input type="hidden" name="_method" value="verify" />
              </>
            )}
            <Button disabled={busy} type="submit" variant="contained">
              {busy ? "Submittting..." : "Login"}
            </Button>
          </Stack>
        </Form>
      </Box>
    </Box>
  );
}
