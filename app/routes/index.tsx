import { Box, Button, Divider, Typography } from "@mui/material";
import {
  ActionFunction,
  json,
  LoaderFunction,
  redirect,
} from "@remix-run/node"; // or cloudflare/deno
import { Form, Link, useLoaderData } from "@remix-run/react";
import { userAbility } from "~/utils/defineAbility.server";
import { getUser, getUserData } from "~/utils/session.server";

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userData = await getUserData(request);
  if (!userData) return redirect("/login");
  const checkAbility = await userAbility(userData?.id);
  if (!checkAbility) return redirect("/login");
  const user = await getUser(request);
  return json({ user });
};

export const action: ActionFunction = () => {};

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
          <Box display="flex" justifyContent="space-around">
            <Typography
              p={4}
              color="white"
              variant="h5"
              sx={{ textAlign: "center" }}
            >
              Well come <b>{user?.first_name.toUpperCase()} </b>
              to Remix
            </Typography>
            <Form method="post" action="/logout">
              <Button
                sx={{
                  fontWeight: "bold",
                  color: "darkcyan",
                  mt: "20px",
                  backgroundColor: "whitesmoke",
                  ":hover": {
                    border: "1px solid whitesmoke ",
                    backgroundColor: "darkcyan",
                    color: "whitesmoke",
                  },
                }}
                type="submit"
                variant="contained"
              >
                Logout
              </Button>
            </Form>
          </Box>
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
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="error-container">
      <pre>{error.message}</pre>
    </div>
  );
}
