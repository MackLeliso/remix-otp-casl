import { db } from "./db.server";

export const createProduct = async (id: string) => {};
export const updateProduct = async (id: string) => {};

export const deleteProduct = async () => {
  try {
    const product = await db.product.findMany();
    console.log("product deleted", product);
  } catch (error) {
    console.log("error", error);
  }
};
