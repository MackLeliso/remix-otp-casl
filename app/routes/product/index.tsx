import { Box } from "@mui/material";
import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { db } from "~/utils/db.server";
import Category from "components/products/Category";
import ProductTable from "components/products/ProductTable";
import { getUserData } from "~/utils/session.server";
import { userAbility } from "~/utils/defineAbility.server";
import { subject } from "@casl/ability";
import { validProduct } from "~/utils/validation.server";
import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "~/utils/product.server";
export const loader: LoaderFunction = async ({ request }) => {
  const { id } = await getUserData(request);

  // search for products params
  const url = new URL(request.url);
  const name = url.searchParams.getAll("category");
  const search = url.searchParams.getAll("search");
  const column = url.searchParams.getAll("columnField")[0] || "name";
  const operator = url.searchParams.getAll("operatorValue")[0] || "contains";
  const value = url.searchParams.getAll("value")[0] || "";
  const field = url.searchParams.getAll("field")[0] || "name";
  const sort = url.searchParams.getAll("sort")[0] || "asc";
  // delete product param
  const deletePID = url.searchParams.getAll("deletePID")[0];

  // pagination
  const limit = Number(url.searchParams.get("limit")) || 3;
  const test = Number(url.searchParams.get("offset"));
  const offset = test ? test : 0;
  const skip = limit * offset;

  // get category
  const categories = await db.productCategory.findMany({});
  if (!categories) return null;

  // get products and it's total
  const data = {
    name: name[0],
    column,
    operator,
    value,
    search: search[0],
    field,
    skip,
    sort,
    limit,
  };
  const { productList, totalCount } = await getProducts(data);
  let message;
  if (deletePID) {
    message = await deleteProduct(deletePID);
  }

  // user ability on product
  const prod = productList.map(async (product) => ({
    ...product,
    canDelete: await (
      await userAbility(id)
    )?.can("delete", subject("product", { productId: product.id })),
    canEditDesc: await (
      await userAbility(id)
    )?.can(
      "update",
      subject("product", { productId: product.id }),
      "description"
    ),
    canEditPrice: await (
      await userAbility(id)
    )?.can("update", subject("product", { productId: product.id }), "price"),
  }));
  const products = await Promise.all(prod);
  return json({ products, totalCount, categories, message });
};

export const action: ActionFunction = async ({ request, params }) => {
  const { id } = await getUserData(request);
  const validData = await validProduct(
    Object.fromEntries(await request.formData())
  );
  console.log("validData", validData);
  const data = { userId: id, ...validData.data };

  // return error message
  if (validData.success === false) return validData;

  // update product
  if (validData.data.id) {
    const product = await updateProduct(data);
    if (product)
      return json({ status: 200, message: "product updated successfully" });
  }

  // create product
  const product = await createProduct(data);
  if (product)
    return json({ status: 200, message: "product created successfully" });
  return validData;
};
// products ui components
export default function Products() {
  return (
    <Box minWidth="100vw" minHeight="100vh" bgcolor="darkcyan">
      <Box width="100vw" display="flex" justifyContent="space-between">
        <Box minWidth="10vw">
          <Category />
        </Box>
        <Box m={1} minWidth="80vw" display="flex" justifyContent="center">
          <ProductTable />
        </Box>
      </Box>
    </Box>
  );
}
