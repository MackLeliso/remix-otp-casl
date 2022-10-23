import { Box, Divider, Typography } from "@mui/material";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { getUser, getUserData } from "~/utils/session.server";

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const auth = await getUserData(request);
  console.log(auth);
  if (!auth) return redirect("/login");
  const user = await getUser(request);
  const data: LoaderData = {
    user,
  };
  return json({ user });
};

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
