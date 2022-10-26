import { Box } from "@mui/material";
import { json, LoaderFunction, redirect } from "@remix-run/node";
import {
  useLoaderData,
  useOutletContext,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { db } from "~/utils/db.server";
import Category from "components/products/Category";
import ProductTable from "components/products/ProductTable";
import { getUserData } from "~/utils/session.server";
import { userAbility } from "~/utils/defineAbility.server";
import { subject } from "@casl/ability";
export const loader: LoaderFunction = async ({ request }) => {
  const { id } = await getUserData(request);

  // search for products
  const url = new URL(request.url);
  const name = url.searchParams.getAll("category");
  const search = url.searchParams.getAll("search");
  const column = url.searchParams.getAll("columnField")[0] || "name";
  const operator = url.searchParams.getAll("operatorValue")[0] || "contains";
  const value = url.searchParams.getAll("value")[0] || "";
  const field = url.searchParams.getAll("field")[0] || "name";
  const sort = url.searchParams.getAll("sort")[0] || "asc";
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
  const [productList, totalCount] = await db.$transaction([
    db.product.findMany({
      where: {
        delete: false,
        category: {
          name: {
            contains: name[0],
          },
        },
        [column]: { [operator]: value || search[0] },
      },
      orderBy: { [field]: sort },
      skip: skip,
      take: limit,
    }),
    db.product.count({
      where: { delete: false },
    }),
  ]);
  let message;
  if (deletePID) {
    message = await db.$transaction(async () => {
      const getProduct = await db.product.findFirst({
        where: {
          id: deletePID,
          delete: false,
        },
      });
      if (!getProduct) return { status: 404, message: "Product not found" };
      await db.product.update({
        where: { id: deletePID },
        data: { delete: true },
      });
      return {
        status: 200,
        message: "Successfully product is deleted",
      };
    });
  }

  const prod = productList.map(async (product) => ({
    ...product,
    canDelete: await (
      await userAbility(id)
    ).can("delete", subject("product", { id: id, productId: product.id })),
  }));
  const products = await Promise.all(prod);
  return json({ products, totalCount, categories, message });
};

// products ui components
export default function Products() {
  const { products, totalCount, categories, message } = useLoaderData();
  console.log("fff", message);
  const submit = useSubmit();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.getAll("category");
  return (
    <Box minWidth="100vw" minHeight="100vh" bgcolor="darkcyan">
      <Box width="100vw" display="flex" justifyContent="space-between">
        <Box minWidth="10vw">
          <Category categories={categories} submit={submit} />
        </Box>
        {/* {viewProduct ? (
          <Box width="60vw">
            <Product
              categories={categories}
              products={products}
              submit={submit}
            />
          </Box>
        ) : null} */}
        <Box m={1} minWidth="80vw" display="flex" justifyContent="center">
          <ProductTable
            category={category}
            products={products}
            submit={submit}
            totalCount={totalCount}
            message={message}
          />
        </Box>
      </Box>
    </Box>
  );
}
