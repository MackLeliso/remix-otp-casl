import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { ActionFunction, json, ActionArgs } from "@remix-run/node";
import { Form, useTransition, useActionData, Outlet } from "@remix-run/react";
import { User } from "@prisma/client";

import { RegistrationOtp, verifyOtp } from "~/utils/otp.server";
import {
  clearSession,
  createFormSession,
  createUserSession,
  getFormData,
  getUserData,
  logout,
} from "~/utils/session.server";
type ActonData = {
  first_name: string;
  last_name: string;
  phone: string;
  code: string;
  _method: string;
};
export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const formData = await request.formData();

  const { first_name, last_name, phone, code, _method } = Object.fromEntries(
    formData
  ) as ActonData;
  let userFormData = { first_name, last_name, phone };

  console.log(userFormData);
  const phoneResponse = await RegistrationOtp(phone);
  console.log("clear");
  const data = await getUserData(request);
  console.log("data", data);
  if (phoneResponse?.message === "otp-sent")
    return await createUserSession(userFormData, "/user/verify");
};

export default function signup() {
  const actionData = useActionData();
  console.log("actionData", actionData);
  const { state } = useTransition();
  const busy = state === "submitting";

  return (
    <Box display="flex" justifyContent="center" p={5}>
      <Box minWidth={500} bgcolor="skyblue" borderRadius={2}>
        <Form method="post">
          <Stack spacing={{ xs: 1, sm: 2, md: 3 }} p={3}>
            <Typography variant="subtitle2" color="error">
              {actionData?.rejected}
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

            <Button disabled={busy} type="submit" variant="contained">
              {busy ? "Submittting..." : "Submit"}
            </Button>
          </Stack>
        </Form>
      </Box>
      <Outlet />
    </Box>
  );
}
