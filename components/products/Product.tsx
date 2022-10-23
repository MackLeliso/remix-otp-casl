import { Box, Grid, TextField, Typography } from "@mui/material";
import { Form, Link } from "@remix-run/react";

// product  list component
export default function Product({ products, submit }: any) {
  return (
    <Grid container spacing={2} p={3}>
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
  );
}
