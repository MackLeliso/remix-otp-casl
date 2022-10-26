import { ForbiddenError, subject } from "@casl/ability";
import { Box, Divider, Typography } from "@mui/material";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { userAbility } from "~/utils/defineAbility.server";
import { getUserData } from "~/utils/session.server";

export const loader: LoaderFunction = async ({ request }) => {
  const { id } = await getUserData(request);
  if (!id) return redirect("/login");
  ForbiddenError.from(await userAbility(id)).throwUnlessCan("read", "product");
  const url = new URL(request.url);

  const deletePID = url.searchParams.getAll("deletePID")[0];
  if (deletePID) {
    const productAbility = await (
      await userAbility(id)
    ).can("delete", subject("product", { id: id, productId: deletePID }));
    if (productAbility) {
      await db.product.delete({
        where: { id: deletePID },
      });
      return json({
        status: 200,
        message: "Successfully product is deleted",
      });
    } else {
      return json({ status: 401, message: "You can't delete product" });
    }
  }

  return null;
};

//  products user interfce
export default function Products() {
  const message = useLoaderData();
  return (
    <Box bgcolor="darkcyan" position="absolute">
      {/* {productAbility.can("delete", "product")} */}
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
      <Outlet context={message} />
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
