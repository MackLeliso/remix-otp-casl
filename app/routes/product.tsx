import { Box, Divider, Typography } from "@mui/material";
import { Outlet } from "@remix-run/react";

export default function Products() {
  return (
    <Box display="flex" justifyContent="center" p={5}>
      <Box minWidth={1000} bgcolor="darkcyan" borderRadius={2}>
        <Typography
          textAlign="center"
          mb={2}
          variant="h4"
          color="whitesmoke"
          fontWeight="bold"
        >
          Well come to product
        </Typography>
        <Divider
          sx={{
            backgroundColor: "white",
            textAlign: "center",
            margin: "0 25px",
          }}
        />
        <Outlet />
      </Box>
    </Box>
  );
}
