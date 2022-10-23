import { Box, Divider, Typography } from "@mui/material";
import { Outlet } from "@remix-run/react";

//  products user interfce
export default function Products() {
  return (
    <Box bgcolor="darkcyan" position="absolute">
      <Typography
        textAlign="center"
        p={3}
        variant="h4"
        color="whitesmoke"
        fontWeight="bold"
      >
        Well come to market place
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
  );
}
