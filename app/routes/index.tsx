import { ForbiddenError } from "@casl/ability";
import { json, LoaderFunction } from "@remix-run/node"; // or cloudflare/deno
import { useLoaderData } from "@remix-run/react";
import authenticator from "~/utils/auth.server";
import { userAbility } from "~/utils/defineAbility.server";

export const loader: LoaderFunction = async ({ request }) => {
  const auth: any = await authenticator.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  console.log(
    "ability.M",
    (await userAbility(auth.roleId)).can("read", "user")
  );
  ForbiddenError.from(await userAbility(auth.roleId)).throwUnlessCan(
    "read",
    "user"
  );

  const able = (await userAbility(auth.roleId)).can("read", "user");

  // const able = await userAbility(auth.roleId);

  console.log(await userAbility(auth.roleId));

  console.log("fffffffffffff");

  return able;
};

export default function Index() {
  const loaderData = useLoaderData();
  console.log(loaderData);
  // console.log(loaderData);
  // console.log(loaderData?.abili);

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <p>
        {" "}
        Hello <b>{loaderData?.first_name}</b>, Well come to Dashboard
      </p>
      {loaderData ? <p>user</p> : null}

      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
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
