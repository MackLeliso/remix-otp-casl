import { ForbiddenError, subject } from "@casl/ability";
import { Box, Divider, Typography } from "@mui/material";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { userAbility } from "~/utils/defineAbility.server";
import { getUser, getUserData } from "~/utils/session.server";

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const auth = await getUserData(request);
  if (!auth) return redirect("/login");
  const user = await getUser(request);
  const data: LoaderData = {
    user,
  };
  ForbiddenError.from(await userAbility(auth)).throwUnlessCan(
    "read",
    "product"
  );
  const deleteOwnProduct = (await userAbility(auth)).can(
    "delete",
    subject("product", {
      id: auth.id,
      productId: ["6f65f860-5862-4f9b-aaa5-fc642a77ba98d"],
      z,
    })
  );
  console.log("deleteOwnProduct", deleteOwnProduct);
  return json({ user, deleteOwnProduct });
};

//  products user interfce
export default function Products() {
  const { deleteOwnProduct } = useLoaderData();
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
      <Outlet context={deleteOwnProduct} />
    </Box>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Box bgcolor="red">
      <Box p={5}>
        <h1>App Error</h1>
        <pre>{error.message}</pre>
      </Box>
    </Box>
  );
}
