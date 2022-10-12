import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const role = await prisma.role.create({
    data: {
      name: "superadmin role",
      description: "superadmin role take any of action on system",
      user: {
        create: {
          first_name: "leo",
          last_name: "messi",
          phone: "0928425097",
        },
      },
      permission: {
        create: {
          permission: {
            create: {
              name: "manage all",
              description: "This permission can manage all of the system",
              action: "manage",
              subject: "all",
            },
          },
        },
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
