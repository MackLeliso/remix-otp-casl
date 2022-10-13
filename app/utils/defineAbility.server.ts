import { createMongoAbility } from "@casl/ability";
import { db } from "./db.server";

export const userAbility = async (roleId: string) => {
  const userPermissions = await db.role.findUnique({
    where: { id: roleId },
    include: {
      permission: {
        select: {
          permission: {
            select: {
              action: true,
              subject: true,
            },
          },
        },
      },
    },
  });

  const permission = userPermissions?.permission.map(
    (permission) => permission.permission
  );

  return createMongoAbility(permission);
};

// export default userAbility;
