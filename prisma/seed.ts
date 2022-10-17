import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const role = await prisma.role.create({
    data: {
      name: "test role",
      description: "this role take some of action on system",
      user: {
        create: {
          first_name: "mesut",
          last_name: "ozil",
          phone: "0924011541",
        },
      },
      permission: {
        create: [
          {
            permission: {
              create: {
                name: "view user",
                description: "This permission can read all of user on system",
                action: "read",
                subject: "user",
              },
            },
          },
          {
            permission: {
              create: {
                name: "update username and password",
                description: "This permission can only his or her username",
                action: "update",
                subject: "user",
                fields: ["username", "password"],
                conditions: { id: "userId" },
              },
            },
          },
          {
            permission: {
              create: {
                name: "delete post",
                description: "This permission can delete only his or her post",
                action: "delete",
                subject: "post",
                conditions: { id: "userId" },
              },
            },
          },
        ],
      },
    },
  });
  console.log(role);
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
