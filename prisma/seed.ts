import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  const role = await prisma.role.create({
    data: {
      name: "product owner role",
      description: "this role take some of action on the system",
      permission: {
        create: [
          {
            permission: {
              create: {
                name: "view  product",
                description:
                  "This permission can read all of product on the system",
                action: "read",
                subject: "product",
              },
            },
          },
          {
            permission: {
              create: {
                name: "create product",
                description: "This permission can create product",
                action: "create",
                subject: "product",
              },
            },
          },
          {
            permission: {
              create: {
                name: "delete his product",
                description:
                  "This permission can delete only his or her product",
                action: "delete",
                subject: "product",
                conditions: { productId: "productId" },
              },
            },
          },
        ],
      },
    },
  });
  console.log(role);

  const user = await prisma.user.create({
    data: {
      first_name: "leo",
      last_name: "messi",
      phone: "0928425097",
      roleId: role.id,
    },
  });

  console.log(user);

  const shoeCat = await prisma.productCategory.create({
    data: {
      name: "shoes",
      description:
        "this product category can be used to create product on the system",
    },
  });
  const clothCat = await prisma.productCategory.create({
    data: {
      name: "cloths",
      description:
        "this product category can be used to create product on the system",
    },
  });

  const product = await prisma.product.createMany({
    data: [
      {
        name: "vans",
        description: "made in vetinam",
        userId: user.id,
        categoryId: shoeCat.id,
      },
      {
        name: "addids",
        description: "made in china",
        userId: user.id,
        categoryId: shoeCat.id,
      },
      {
        name: "nike",
        description: "made in ethio",
        userId: user.id,
        categoryId: shoeCat.id,
      },
      {
        name: "jeep",
        description: "made in vetinam",
        userId: user.id,
        categoryId: shoeCat.id,
      },
      {
        name: "gucci",
        description: "made in china",
        userId: user.id,
        categoryId: shoeCat.id,
      },
      {
        name: "cotex",
        description: "made in ethio",
        userId: user.id,
        categoryId: shoeCat.id,
      },
      {
        name: "gucci",
        description: "made in vetinam",
        userId: user.id,
        categoryId: clothCat.id,
      },
      {
        name: "cat",
        description: "made in china",
        userId: user.id,
        categoryId: clothCat.id,
      },
      {
        name: "zara",
        description: "made in ethio",
        userId: user.id,
        categoryId: clothCat.id,
      },
      {
        name: "brand",
        description: "made in vetinam",
        userId: user.id,
        categoryId: clothCat.id,
      },
      {
        name: "cotex cloth",
        description: "made in china",
        userId: user.id,
        categoryId: clothCat.id,
      },
      {
        name: "nike cloth ",
        description: "made in ethio",
        userId: user.id,
        categoryId: clothCat.id,
      },
    ],
  });

  console.log(product);
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
