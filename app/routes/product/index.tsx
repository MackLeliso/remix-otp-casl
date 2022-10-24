import { Box } from "@mui/material";
import { LoaderFunction } from "@remix-run/node";
import {
  useLoaderData,
  useOutletContext,
  useSearchParams,
  useSubmit,
} from "@remix-run/react";
import { db } from "~/utils/db.server";
import Category from "components/products/Category";
import ProductTable from "components/products/ProductTable";
import Product from "components/products/Product";
export const loader: LoaderFunction = async ({ request }) => {
  // search for products
  const url = new URL(request.url);
  const name = url.searchParams.getAll("category");
  const search = url.searchParams.getAll("search");
  const column = url.searchParams.getAll("columnField")[0] || "name";
  const operator = url.searchParams.getAll("operatorValue")[0] || "contains";
  const value = url.searchParams.getAll("value")[0] || "";
  const field = url.searchParams.getAll("field")[0] || "name";
  const sort = url.searchParams.getAll("sort")[0] || "asc";

  console.log("search", search);

  // get category
  const categories = await db.productCategory.findMany({});
  if (!categories) return null;

  // pagination
  const limit = Number(url.searchParams.get("limit")) || 2;
  const test = Number(url.searchParams.get("offset"));
  const offset = test ? test : 0;
  const skip = limit * offset;

  // get products and it's total
  const [products, totalCount] = await db.$transaction([
    db.product.findMany({
      where: {
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
    db.product.count(),
  ]);

  return { products, totalCount, categories };
};

// products ui components
export default function Products() {
  const deleteOwnProduct = useOutletContext();
  const { products, totalCount, categories } = useLoaderData();
  const submit = useSubmit();
  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.getAll("category");
  return (
    <Box
      minWidth="100vw"
      minHeight="100vh"
      bgcolor="darkcyan"
      display="flex"
      justifyContent="space-arround"
    >
      <Box minWidth="20vw">
        <Category categories={categories} submit={submit} />
      </Box>
      {deleteOwnProduct ? (
        <Box width="45vw">
          <Product
            categories={categories}
            products={products}
            submit={submit}
          />
        </Box>
      ) : null}
      <Box minWidth="30vw">
        <ProductTable
          category={category}
          products={products}
          submit={submit}
          totalCount={totalCount}
        />
      </Box>
    </Box>
  );
}
