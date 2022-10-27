import { db } from "./db.server";

type ProductData = {
  name: string;
  column: string;
  operator: string;
  value: string;
  search: string;
  field: string;
  skip: number;
  sort: string;
  limit: number;
};
export const getProducts = async (data: ProductData) => {
  try {
    const { name, column, operator, value, search, field, skip, sort, limit } =
      data;
    const [productList, totalCount] = await db.$transaction([
      db.product.findMany({
        where: {
          delete: false,
          category: {
            name: {
              contains: name,
            },
          },
          [column]: { [operator]: value || search },
        },
        orderBy: { [field]: sort },
        skip: skip,
        take: limit,
      }),
      db.product.count({
        where: { delete: false },
      }),
    ]);

    return { productList, totalCount };
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};

export const createProduct = async (productData: any) => {
  try {
    const product = await db.product.create({
      data: productData,
    });
    return product;
  } catch (error: any) {
    console.error(error);
    throw new Error(error);
  }
};
export const updateProduct = async (id: string) => {};

export const deleteProduct = async (id: string) => {
  try {
    return await db.$transaction(async () => {
      const getProduct = await db.product.findFirst({
        where: {
          id,
          delete: false,
        },
      });
      if (!getProduct) return { status: 404, message: "Product not found" };
      await db.product.update({
        where: { id },
        data: { delete: true },
      });
      return {
        status: 200,
        message: "Successfully product is deleted",
      };
    });
  } catch (error) {
    console.log("error", error);
  }
};
