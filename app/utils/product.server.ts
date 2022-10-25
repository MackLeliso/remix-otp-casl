import { db } from "./db.server";

export const createProduct = async (id: any) => {};
export const updateProduct = async (id: any) => {};

export async function deleteProduct(id: string) {
  console.log("productI", id);
  return new Promise(async function (resolve, reject) {
    console.log("dddd", id);

    const product = await db.product.delete({
      where: { id },
    });
    console.log("product deleted", product);
    resolve(product);
  });
}
