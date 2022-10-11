import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { db } from "./db.server";
import { User } from "@prisma/client";
import { sessionStorage } from "./session.server";
import { createUser } from "./user.server";
const authenticator = new Authenticator<
  Pick<User, "first_name" | "last_name" | "phone"> | Error | null
>(sessionStorage, {
  sessionKey: "sessionKey", // keep in sync
  sessionErrorKey: "sessionErrorKey", // keep in sync
});
export const USER_LOGIN = "user-login";
authenticator.use(
  new FormStrategy(async ({ context }: any) => {
    const { formData } = context;
    const userData = JSON.parse(formData.get("user"));
    let user: any;
    if (userData) {
      user = await createUser(userData);
      console.log("user", user);
      return await Promise.resolve(user);
    }
  })
);

export default authenticator;

// export const userLogin = async (email: string, password: string) => {
//   const user = await db.user.findUnique({
//     where: { email: email },
//   });

//   if (!user) return null;

//   const isCorrectPassword = await bcrypt.compare(password, user.password);

//   if (!isCorrectPassword) return null;

//   return user;
// };
// const saltRounds = 10;

// export const hashPassword = async (password: string) => {
//   return bcrypt.hash(password, saltRounds);
// };
