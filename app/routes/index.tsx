import { ForbiddenError, subject } from "@casl/ability";
import { Box, Divider, Typography } from "@mui/material";
import { json, LoaderFunction, redirect } from "@remix-run/node"; // or cloudflare/deno
import { Link, useLoaderData } from "@remix-run/react";
import { userAbility } from "~/utils/defineAbility.server";
import {
  getSession,
  getUser,
  getUserData,
  logout,
} from "~/utils/session.server";

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

  // ForbiddenError.from(await userAbility(auth)).throwUnlessCan("read", "user");

  // const user = (await userAbility(auth)).can("read", "user");
  // const post = (await userAbility(auth)).can(
  //   "delete",
  //   subject("post", { id: auth.id })
  // );
  // const comment = (await userAbility(auth)).can("read", "comment");
  // const role = (await userAbility(auth)).can("read", "role");
  // const permission = (await userAbility(auth)).can("read", "permission");
  // const permissions = {
  //   user,
  //   // post,
  //   // role,
  //   // permission,
  //   // comment,
  // };

  // return json({ permission: permissions, auth: auth });
  return json({ user });
};
export default function Index() {
  const { user } = useLoaderData<LoaderData>();

  return (
    <Box>
      <Box display="flex" alignItems="center" justifyContent="center">
        <Box
          sx={{
            backgroundColor: "darkcyan",
            height: "100vh",
            width: "100vw",
          }}
        >
          <Typography
            p={4}
            color="white"
            variant="h5"
            sx={{ textAlign: "center" }}
          >
            Well come <b>{user?.first_name.toUpperCase()} </b>
            to Remix
          </Typography>
          <Divider sx={{ color: "white" }} />
          <Box
            color="whitesmoke"
            textAlign="center"
            fontWeight="bold"
            bgcolor="darkcyan"
            borderRadius={1}
            margin="12px"
            padding="12px"
            sx={{
              ":hover": {
                bgcolor: "whitesmoke",
                color: "darkcyan",
                transition: ".5s",
              },
            }}
          >
            <Link
              style={{
                textDecoration: "none",
                alignSelf: "auto",
              }}
              to="product"
            >
              Get in to product page
            </Link>
          </Box>
        </Box>
      </Box>
    </Box>

    /* <ul>
        {permission?.user ? (
          <li>
            <a href="." rel="noreferrer">
              <p>user</p>
            </a>
          </li>
        ) : null}
        {permission?.role ? (
          <li>
            <a href="." rel="noreferrer">
              <p> role</p>
            </a>
          </li>
        ) : null}

        {permission?.permission ? (
          <li>
            <a href="." rel="noreferrer">
              <p>permission</p>
            </a>
          </li>
        ) : null}

        {permission?.post ? (
          <li>
            <a href="." rel="noreferrer">
              <p> delete post</p>
            </a>
          </li>
        ) : null}

        {permission?.comment ? (
          <li>
            <a href="." rel="noreferrer">
              <p>comment</p>
            </a>
          </li>
        ) : null}
      </ul> */
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="error-container">
      <pre>{error.message}</pre>
    </div>
  );
}
