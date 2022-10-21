import { Box, Button, Stack, TextField, Typography } from "@mui/material";
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
  const checkVerification = await verifyOtp(code);
  if (checkVerification.message === "Approved") {
    const data = await getUserData(request);
    const user = await db.user.create({
      data: data,
    });
    return await createUserSession(user, "/");
  }

  return null;
};
export default function verify() {
  const actionData = useActionData();
  console.log("actionData", actionData);
  const { state } = useTransition();
  const busy = state === "submitting";

  return (
    <Box display="flex" justifyContent="center" p={5}>
      <Box minWidth={500} bgcolor="skyblue" borderRadius={2}>
        <Form method="post">
          <Stack spacing={{ xs: 1, sm: 2, md: 3 }} p={3}>
            <TextField
              id="filled-hidden-label-small"
              placeholder="Code"
              name="code"
              variant="filled"
              size="small"
            />
            <input type="hidden" name="_method" value="verifiy" />
            <Button disabled={busy} type="submit" variant="contained">
              {busy ? "Submittting..." : "Submit"}
            </Button>
          </Stack>
        </Form>
      </Box>
    </Box>
  );
}
