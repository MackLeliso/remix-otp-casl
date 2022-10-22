import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { User } from "@prisma/client";
import { ActionFunction, json, ActionArgs } from "@remix-run/node";
import { Form, useTransition, useActionData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { verifyOtp } from "~/utils/otp.server";
import { createUserSession, getUserData } from "~/utils/session.server";
type ActonData = {
  first_name: string;
  last_name: string;
  phone: string;
  code: string;
  _method: string;
};
export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const formData = await request.formData();
  const { code } = Object.fromEntries(formData) as ActonData;
  const data = await getUserData(request);
  const checkVerification: {
    message: string;
    status?: undefined | number;
    data?: any;
  } = await verifyOtp(code, data.phone);

  if (checkVerification.message === "Approved") {
    const loginUser: Pick<User, "id" | "first_name" | "last_name"> | null =
      await db.user.findUnique({
        where: { phone: data.phone },
        select: {
          id: true,
          first_name: true,
          last_name: true,
        },
      });

    if (loginUser) return await createUserSession(loginUser, "/");

    // user registration
    const role = await db.role.findFirst({
      where: { name: "test role" },
      select: { id: true },
    });
    const registerUser = await db.user.create({
      data: { roleId: role?.id, ...data },
      select: {
        id: true,
        first_name: true,
        last_name: true,
      },
    });
    return await createUserSession(registerUser, "/");
  }

  return checkVerification;
};
export default function verify() {
  const actionData = useActionData();
  console.log("actionData", actionData);
  const { state } = useTransition();
  const busy = state === "submitting";

  return (
    <Box display="flex" justifyContent="center" p={5}>
      <Box minWidth={500} bgcolor="darkcyan" borderRadius={2}>
        <Form method="post">
          <Stack spacing={{ xs: 2, sm: 2, md: 3 }} p={5} gap={2}>
            <Typography mb={2} variant="subtitle1" color="error">
              {actionData?.message}
            </Typography>
            <TextField
              id="filled-hidden-label-small"
              placeholder="OTP Code"
              name="code"
              variant="filled"
              size="small"
              defaultValue={actionData?.otpNumber}
            />
            <Button
              color="info"
              disabled={busy}
              type="submit"
              variant="contained"
            >
              {busy ? "Verifying..." : "Verify"}
            </Button>
          </Stack>
        </Form>
      </Box>
    </Box>
  );
}
