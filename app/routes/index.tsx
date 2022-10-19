import { ForbiddenError, subject } from "@casl/ability";
import { json, LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";
import authenticator from "~/utils/auth.server";
import { userAbility } from "~/utils/defineAbility.server";

export const loader: LoaderFunction = async ({ request }) => {
  const auth: {
    id: string;
    first_name: string;
    last_name: string;
    phone: string;
  } = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  ForbiddenError.from(await userAbility(auth)).throwUnlessCan("read", "user");

  const user = (await userAbility(auth)).can("read", "user");
  const post = (await userAbility(auth)).can(
    "delete",
    subject("post", { id: auth.id })
  );
  const comment = (await userAbility(auth.id)).can("read", "comment");
  const role = (await userAbility(auth)).can("read", "role");
  const permission = (await userAbility(auth.id)).can("read", "permission");
  const permissions = {
    user,
    post,
    role,
    permission,
    comment,
  };

  return json({ permission: permissions, auth: auth });
};

export default function Index() {
  const { auth, permission } = useLoaderData();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <p>
        {" "}
        Hello{" "}
        <b>
          {auth?.first_name.charAt(0).toUpperCase() + auth?.first_name.slice(1)}
        </b>
        , Well come to Dashboard
      </p>

      <ul>
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
      </ul>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div className="error-container">
      <pre>{error.message}</pre>
    </div>
  );
}
