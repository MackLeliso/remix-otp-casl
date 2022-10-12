import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { ActionFunction, json } from "@remix-run/node";
import { Form, useTransition, useActionData } from "@remix-run/react";
import authenticator from "~/utils/auth.server";
import { checkPhoneNumberExist } from "~/utils/user.server";
import {
  checkPhoneVerification,
  phoneVerification,
} from "~/utils/verification";

export const action: ActionFunction = async ({ context, request }) => {
  const formData = await request.formData();
  const submitType = formData.get("_method");
  if (submitType === "login") {
    const phone = formData.get("phone");
    const checkPhone = await checkPhoneNumberExist(phone);
    if (checkPhone) {
      await phoneVerification(phone);
      return json({ phone });
    }
  }

  if (submitType === "verify") {
    const code: any = formData.get("code");
    const _phone: any = formData.get("_phone");

    const checkStatus: any = await checkPhoneVerification(_phone, code);
    if (checkStatus.status === "approved") {
      return await authenticator.authenticate("form", request, {
        successRedirect: "/",
        failureRedirect: "/login",
        throwOnError: true,
        context: { formData },
      });
    } else if (checkStatus.status === "rejected") {
      return json({ rejected: "please try again" });
    } else {
      return json({ rejected: "Something went wrong, Please try again" });
    }
  }
};

export default function signIn() {
  const actionData = useActionData();
  console.log(actionData);

  const { state } = useTransition();
  const busy = state === "submitting";

  return (
    <Box display="flex" justifyContent="center" p={5}>
      <Box minWidth={500} bgcolor="skyblue" borderRadius={2}>
        <Form method="post">
          <Stack spacing={{ xs: 1, sm: 2, md: 3 }} p={3}>
            {actionData?.phone === undefined ? (
              <>
                <Typography fontWeight="bold" color="dark" textAlign="center">
                  Sign In
                </Typography>
                <input type="hidden" name="_method" value="login" />
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
              </>
            ) : (
              <>
                <input type="hidden" name="_phone" value={actionData?.phone} />
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
