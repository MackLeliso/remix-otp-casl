import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { ActionFunction, json, ActionArgs } from "@remix-run/node";
import {
  Form,
  useTransition,
  useActionData,
  Outlet,
  Link,
} from "@remix-run/react";
import { User } from "@prisma/client";

export default function User() {
  return (
    <Box display="flex" justifyContent="center" p={5}>
      <Box minWidth={500} bgcolor="skyblue" borderRadius={2}>
        <Form method="post">
          <Stack spacing={{ xs: 1, sm: 2, md: 3 }} p={3}>
            <Typography fontWeight="bold" color="dark" textAlign="center">
              Login Up
            </Typography>
            <Link to="signup">Signup</Link>
            <Link to="verify">Verify</Link>
            <Typography variant="subtitle2" color="error"></Typography>
            {/* <Button disabled={busy} type="submit" variant="contained">
                {busy ? "Submittting..." : "Submit"}
              </Button> */}
          </Stack>
        </Form>
        <Outlet />
      </Box>
    </Box>
  );
}
