import { createMongoAbility } from "@casl/ability";
import { db } from "./db.server";

interface RawRule {
  action: string | string[];
  subject?: string | string[];
  fields?: string[];
  condition?: any;
}

export const userAbility = async (id: string) => {
  const user = await db.user.findFirst({
    where: { id },
  });

  const userPermissions = await db.role.findUnique({
    where: { id: user?.roleId },
    include: {
      permission: {
        select: {
          permission: {
            select: {
              action: true,
              subject: true,
              condition: true,
            },
          },
        },
      },
    },
  });

  const permissions: RawRule[] | any = userPermissions?.permission.map(
    (permission) => permission.permission
  );

  const permission = [];
  for (const item of permissions) {
    const obj: any = {};
    for (const key in item) {
      if (item[key]) obj[key] = item[key];
    }
    permission.push(obj);
  }
  console.log("userPermissions", permission);

  return createMongoAbility(permission);
};
