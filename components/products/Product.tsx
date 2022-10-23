import { Box, Grid, TextField, Typography } from "@mui/material";
import { Form, Link } from "@remix-run/react";

export default function Product({
  categories,
  products,
  handleChange,
  submit,
}: any) {
  return (
    <>
      <Grid container spacing={2} p={3}>
        <Grid item xs={3} bgcolor="whitesmoke" borderRadius={1}>
          {categories?.map((category: any) => (
            <>
              <Grid
                item
                xs={10}
                m={1}
                p={1.5}
                width={150}
                color="whitesmoke"
                textAlign="center"
                bgcolor="darkcyan"
                borderRadius={1}
                sx={{
                  ":hover": {
                    bgcolor: "darkgrey",
                    color: "darkcyan",
                    transition: ".5s",
                  },
                }}
              >
                <Link
                  style={{
                    textDecoration: "none",
                  }}
                  to={`?category=${category.name}`}
                >
                  {category.name}
                </Link>
              </Grid>
            </>
          ))}
        </Grid>
        <Grid item xs={9}>
          <Form method="get" onChange={(e) => submit(e.currentTarget)}>
            <TextField
              sx={{
                display: "flex",
                alignItems: "flex-end",
                margin: "-20px 0 20px 0",
              }}
              name="search"
              variant="standard"
              placeholder="Search"

              // onChange={(e) => submit(e.currentTarget.form)}
            />
          </Form>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            pl={5}
          >
            {products?.map((product: any) => (
              <Box
                bgcolor="white"
                borderRadius={2}
                width="250px"
                justifyContent="space-between"
                m={2}
              >
                <Typography p={1} variant="h4">
                  {product?.name}
                </Typography>
                <Typography p={1}>{product?.description}</Typography>
                <Link style={{ textDecoration: "none" }} to={product.id}>
                  <Typography p={1}>view more</Typography>
                </Link>
              </Box>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
