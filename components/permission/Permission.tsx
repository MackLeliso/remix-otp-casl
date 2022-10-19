import { Box, Grid, TextField, Typography } from "@mui/material";
import { Form } from "@remix-run/react";

export default function Permission({ children, error }: any) {
  return (
    <Form method="post">
      <Box mt={2} gap={2} display="flex" flexDirection="column">
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField name="name" placeholder="name" fullWidth />
            <Typography color="error">{error?.name}</Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField name="description" placeholder="description" fullWidth />
            <Typography color="error">{error?.description}</Typography>{" "}
          </Grid>
          <Grid item xs={6}>
            <TextField name="action" placeholder="action" fullWidth />
            <Typography color="error">{error?.action}</Typography>{" "}
          </Grid>
          <Grid item xs={6}>
            <TextField name="subject" placeholder="subject" fullWidth />
            <Typography color="error">{error?.subject}</Typography>{" "}
          </Grid>
          <Grid item xs={6}>
            <TextField name="conditions" placeholder="conditions" fullWidth />
            <Typography color="error">{error?.conditions}</Typography>{" "}
          </Grid>
          <Grid item xs={6}>
            <TextField name="fields" placeholder="fields" fullWidth />
            <Typography color="error">{error?.fields}</Typography>{" "}
          </Grid>
        </Grid>{" "}
        {children}
      </Box>
    </Form>
  );
}
