import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { ActionFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";

export default function signup() {
  return (
    <Box display="flex" justifyContent="center" p={5}>
      <Box minWidth={500} bgcolor="skyblue" borderRadius={2}>
        <Form method="post">
          <Stack spacing={{ xs: 1, sm: 2, md: 4 }} p={3}>
            <Typography fontWeight="bold" color="dark" textAlign="center">
              Sign In
            </Typography>
            <TextField
              id="filled-hidden-label-small"
              placeholder="First Name"
              name="first_name"
              variant="filled"
              size="small"
            />
            <TextField
              id="filled-hidden-label-small"
              placeholder="First Name"
              name="last_name"
              variant="filled"
              size="small"
            />
            <TextField
              id="filled-hidden-label-small"
              placeholder="First Name"
              name="phone"
              variant="filled"
              size="small"
            />
            <Button type="submit" variant="contained">
              Submit
            </Button>
          </Stack>
        </Form>
      </Box>
    </Box>
  );
}
