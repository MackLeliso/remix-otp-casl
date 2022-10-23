import { Box, Grid, Link, Divider, TextField, Typography } from "@mui/material";
import { LoaderFunction } from "@remix-run/node";
import {
  useActionData,
  useLoaderData,
  useSearchParams,
  useSubmit,
  useTransition,
} from "@remix-run/react";
import Product from "components/products/Product";
import ProductTable from "components/products/ProductTable";
import React, { useEffect, useState } from "react";
import { db } from "~/utils/db.server";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const name = url.searchParams.getAll("category");
  const search = url.searchParams.getAll("search");
  const categories = await db.productCategory.findMany({});
  if (!categories) return null;
  const [products, count] = await db.$transaction([
    db.product.findMany({
      where: {
        category: {
          name: {
            contains: name[0],
          },
        },
        name: { contains: search[0] },
      },
      select: {
        id: true,
        category: true,
        name: true,
        description: true,
      },
    }),
    db.product.count(),
  ]);
  return { products, categories };
};

export default function Products() {
  const actionData = useActionData();
  const { products, categories } = useLoaderData();
  const submit = useSubmit();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchPr = searchParams.getAll("search");
  const category = searchParams.getAll("category");
  console.log("category", category);
  console.log("inname", searchParams);
  submit.bind("john");
  const { state } = useTransition();
  const busy = state === "submitting";
  const [search, setSearch] = useState("");
  function handleChange(event: any) {
    submit(event.currentTarget.value);
  } // console.log("bbbbbbbbb", search);
  // useEffect(() => {
  //   setSearchParams({ searchs: search });
  // }, [setSearchParams]);
  // console.log("meleeeeeee", searchParams);

  const handleSubmit = (e: any) => {
    submit(e.target.form);
  };

  const [pageSize, setPageSize] = React.useState<number>(5);
  return (
    <Box display="flex" justifyContent="center" p={5}>
      <Box minWidth={1000} bgcolor="darkcyan" borderRadius={2}>
        <Product
          categories={categories}
          products={products}
          handleChange={handleChange}
          submit={submit}
        />
        <Box minWidth={500}>
          <ProductTable products={products} />
        </Box>
      </Box>
    </Box>
  );
}
