import { db } from "./db.server";

export const createUser = async (userData: any) => {
  const { first_name, last_name, phone } = userData;
  const checkPhoneExist = await db.user.findFirst({
    where: { phone: phone },
  });
  if (checkPhoneExist) {
    return { error: "Phone number already exists" };
  }
  const user = await db.user.create({
    data: userData,
  });
  return user;
};

export const checkPhoneNumberExist = async (phone: any) => {
  const checkPhoneExist = await db.user.findFirst({
    where: { phone: phone, delete: false },
  });
  return checkPhoneExist;
};
