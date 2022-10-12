import { db } from "./db.server";

export const createUser = async (userData: any) => {
  const user = await db.user.create({
    data: userData,
  });
  return user;
};

export const checkPhoneNumberExist = async (phone: any) => {
  const checkPhoneExist = await db.user.findFirst({
    where: { phone: phone, delete: false },
    select: {
      id: true,
      phone: true,
      first_name: true,
      last_name: true,
    },
  });

  return checkPhoneExist;
};
