import { createCookieSessionStorage, redirect } from "@remix-run/node";
import { db } from "./db.server";

// export the whole sessionStorage object
export let sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "_session", // use any name you want here
    sameSite: "lax", // this helps with CSRF
    path: "/", // remember to add this so the cookie will work in all routes
    httpOnly: true, // for security reasons, make this cookie http only
    secrets: ["s3cr3t"], // replace this with an actual secret
    secure: process.env.NODE_ENV === "production", // enable this in prod only
  },
});

// you can also export the methods individually for your own usage
export let { getSession, commitSession, destroySession } = sessionStorage;

// define the user model
export type User = {
  first_name?: string;
  last_name?: string;
  phone?: string;
  id?: string;
};

function getUserSession(request: Request) {
  return getSession(request.headers.get("Cookie"));
}

export async function getUserData(request: Request) {
  const session = await getUserSession(request);
  const user = session.get("user");
  if (!user) return null;
  return user;
}

export async function getUser(request: Request) {
  const user = await getUserData(request);
  if (typeof user.id !== "string") {
    return null;
  }

  try {
    const userData = await db.user.findUnique({
      where: { id: user.id },
      select: { id: true, first_name: true, last_name: true },
    });
    return userData;
  } catch {
    throw logout(request);
  }
}

export async function logout(request: Request) {
  const session = await getUserSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

export async function createUserSession(user: User, redirectTo: string) {
  const session = await getSession();
  session.set("user", user);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function clearSession(request: Request) {
  return await destroySession(await getUserSession(request));
}

export async function createFormSession(user: User) {
  const session = await getSession();
  session.set("formData", user);
  return redirect("/signup", {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function getFormData(request: Request) {
  const session = await getUserSession(request);
  const user = session.get("formData");
  if (!user) return null;
  return user;
}
