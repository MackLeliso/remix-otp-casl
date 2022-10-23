import { Box } from "@mui/material";
import { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSearchParams, useSubmit } from "@remix-run/react";
import { db } from "~/utils/db.server";
import Category from "components/products/Category";
import ProductTable from "components/products/ProductTable";
import Product from "components/products/Product";

export const loader: LoaderFunction = async ({ request }) => {
  // search for products
  const url = new URL(request.url);
  const name = url.searchParams.getAll("category");
  const search = url.searchParams.getAll("search");
  // get category
  const categories = await db.productCategory.findMany({});
  if (!categories) return null;

  // pagination
  const limit = Number(url.searchParams.get("limit")) || 5;
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
        name: { contains: search[0] },
      },
      orderBy: { name: "asc" },
      skip: skip,
      take: limit,
      select: {
        id: true,
        category: true,
        name: true,
        description: true,
      },
    }),
    db.product.count(),
  ]);

  return { products, totalCount, categories };
};

// products ui components
export default function Products() {
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
      justifyContent="space-evenly"
    >
      <Box minWidth="18vw">
        <Category categories={categories} submit={submit} />
      </Box>

      <Box minWidth="48vw">
        <Product categories={categories} products={products} submit={submit} />
      </Box>
      <Box minWidth="25vw">
        <ProductTable
          products={products}
          submit={submit}
          totalCount={totalCount}
        />
      </Box>
    </Box>
  );
}
