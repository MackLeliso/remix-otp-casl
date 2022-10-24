import { db } from "./db.server";

export const createProduct = async (id: any) => {};
export const updateProduct = async (id: any) => {};

export async function deleteProduct(productId) {
  console.log(typeof productId);
  const product = await db.product.findUnique({
    where: { id: productId },
  });
  console.log("product deleted", product);
  return product;
}
