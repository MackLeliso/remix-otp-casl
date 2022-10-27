import { ForbiddenError } from "@casl/ability";
import { Box, Divider, Typography } from "@mui/material";
import { LoaderFunction, redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { userAbility } from "~/utils/defineAbility.server";
import { getUserData } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userData = await getUserData(request);
  if (!userData) return redirect("/login");
  const checkAbility = await userAbility(userData?.id);
  if (!checkAbility) return redirect("/login");
  ForbiddenError.from(await userAbility(userData?.id))
    .setMessage("You can't access this information")
    .throwUnlessCan("read", "product");

  return null;
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

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Box p={5} display="flex" justifyContent="center">
      <Box bgcolor="red" p={5} minWidth={500} borderRadius={2}>
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </Box>
    </Box>
  );
}
